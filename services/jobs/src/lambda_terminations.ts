import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  s3,
} from '@remrob/aws';
import log from '@remrob/log';

import {notifyMasterIfProvision, prisma} from '@remrob/mysql';
// import {notifyMasterIfProvision} from '@remrob/utils';

const deleteTerminatedContractsActive = async () => {
  await prisma.$executeRaw`
    DELETE FROM r2db.services
    WHERE terminated_at IS NOT NULL
      AND next_payment_at IS NULL;
  `;
};

const deleteTerminatedContractsTemplates = async () => {
  await prisma.$executeRaw`
    DELETE FROM r2db.services_templates
    WHERE terminated_at IS NOT NULL
      AND service_template_id NOT IN (
        SELECT service_template_fk
        FROM r2db.services
      );
  `;
};

const deleteTerminatedObjects = async () => {
  const objectsToDelete = (await prisma.$queryRaw`
      SELECT object_id, mqtt_client_id, user_fk 
      FROM r2db.objects
      WHERE terminated_at IS NOT NULL
        AND object_id NOT IN (SELECT object_fk FROM r2db.services)
        AND mqtt_client_id NOT IN (SELECT mqtt_client_fk FROM r2db.widgets_templates_objects)
        AND object_id NOT IN (SELECT master_object_fk FROM r2db.objects_provisions)
      LIMIT 100;
    `) as {object_id: number; mqtt_client_id: string; user_fk: number}[];

  await prisma.$transaction(async (tx) => {
    for (const elem of objectsToDelete) {
      await tx.objects.delete({where: {object_id: elem.object_id}});
    }
  });

  for (const elem of objectsToDelete) {
    notifyMasterIfProvision(elem.mqtt_client_id, 'unregistered', elem.user_fk);
  }

  /* await prisma.$executeRaw`
    DELETE FROM r2db.objects
    WHERE terminated_at IS NOT NULL
      AND object_id NOT IN (SELECT object_fk FROM r2db.services)
      AND mqtt_client_id NOT IN (SELECT mqtt_client_fk FROM r2db.widgets_templates_objects)
      AND object_id NOT IN (SELECT master_object_fk FROM r2db.objects_provisions);
  `; */
};

const deleteTerminatedModels = async () => {
  const res: [] = await prisma.$queryRaw`
    SELECT
      model_id,
      icon
    FROM r2db.models
    WHERE terminated_at IS NOT NULL
      AND model_id NOT IN (
        SELECT model_id
        FROM r2db.objects
      );
  `;

  for (const {model_id, icon} of res) {
    await prisma.$transaction(async (tx) => {
      const rslt = await prisma.$executeRaw`
          DELETE FROM r2db.models
          WHERE terminated_at IS NOT NULL
          AND model_id = ${model_id};`;

      if (rslt === 1) {
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: `images/icons/models/${icon}`,
        });
        await s3.send(deleteObjectCommand);
      }
    });
  }
};

const deleteTerminatedWidgets = async () => {
  const res: [] = await prisma.$queryRaw`
    SELECT widget_template_id
    FROM r2db.widgets_templates
    WHERE widget_template_id NOT IN (SELECT widget_template_fk FROM r2db.widgets)
      AND terminated_at IS NOT NULL
  `;

  // res.forEach(async ({widgetid}: any) => {
  for (const {widget_template_id} of res) {
    await prisma.$transaction(async (tx) => {
      log.trace('terminations tx start');

      const rslt = await tx.$executeRaw`
          DELETE FROM r2db.widgets_templates
          WHERE widget_template_id = ${widget_template_id}
            AND terminated_at IS NOT NULL;
        `;

      if (rslt === 1) {
        const params = {
          Bucket: process.env.S3_BUCKET!,
          Prefix: `widgets/${widget_template_id}/`,
        };
        const command = new ListObjectsV2Command(params);
        const results = await s3.send(command);

        const deleteObjectsCommand = new DeleteObjectsCommand({
          Bucket: process.env.S3_BUCKET,
          Delete: {
            Objects: (results.Contents || []).map((content) => ({
              Key: content.Key,
            })),
          },
        });

        await s3.send(deleteObjectsCommand);
      }
      log.trace('terminations tx end');
    });
    // await prisma.$disconnect();
  }
};

// exports.handler = async () => {
export const handler = async () => {
  let response: {statusCode: number};
  try {
    console.log('-- start of lambda_terminations --');
    await deleteTerminatedContractsActive();
    await deleteTerminatedWidgets();
    await deleteTerminatedModels();
    await deleteTerminatedObjects();
    await deleteTerminatedContractsTemplates();
    console.log('-- end of lambda_terminations --');
  } catch (err) {
    console.error(err, 'lambda_terminations');
    response = {
      statusCode: 500,
    };
  }
  response = {
    statusCode: 200,
  };
  return response;
};

// handler();
