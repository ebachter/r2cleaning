import {TableModels, prisma} from '@remrob/mysql';

export async function getModelData(mqtt_client_id: string) {
  if (!mqtt_client_id) {
    throw new Error('getModelData consts error');
  }

  const rslt = await prisma.objects.findFirstOrThrow({
    select: {
      models: {select: {mapping_out: true}},
    },
    where: {
      mqtt_client_id,
    },
  });

  const rslt2 = rslt.models.mapping_out as
    | TableModels['mapping_out']
    | undefined;

  return rslt2;

  /* try {
    const rslt: {mapping_out: any}[] = await prisma.$queryRaw`
      SELECT m.mapping_out 
      FROM r2db.objects o
      INNER JOIN r2db.models m ON m.model_id = o.model_fk
      WHERE o.mqtt_client_id = ${mqtt_client_id};
    `;

    return rslt[0].mapping_out || null;
  } catch (err) {
    log.error({err}, 'err getModelData');
  } */
}
