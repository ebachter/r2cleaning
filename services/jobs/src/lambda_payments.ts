import log, {pinoWithRequest} from '@remrob/log';
import {prisma, Prisma} from '@remrob/mysql';
import {Handler} from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) pinoWithRequest(event, context);

  await processSubscriptions();
};

const processSubscriptions = async () => {
  // console.log('>>> processSubscriptions');
  const datetime = new Date();
  // return;
  try {
    await prisma.$transaction(
      async (tx) => {
        log.debug('payment ta start');

        /* const res: any[] = await tx.$queryRaw`
        SELECT * FROM  r2db.services ca
        INNER JOIN r2db.services_templates ct ON ca.service_template_fk = ct.service_template_id
        INNER JOIN r2db.users client           ON ca.user_fk = client.userid
        INNER JOIN r2db.users provider         ON ct.user_fk = provider.userid
        WHERE ct.subscription_value IS NOT NULL AND ${datetime} > ca.next_payment_at
        FOR UPDATE;
      `; */

        const q1 = tx.$executeRaw`
        INSERT INTO r2db.services_transactions(
          service_template_fk,
          contract_fk,
          object_fk,
          user_from,
          user_to,
          balance_from_original,
          balance_to_original,
          transfer_value,
          executed_at,
          next_payment_at
        ) 
        SELECT
          ct.service_template_id,
          ca.service_id,
          ca.object_fk, 
          client.user_id,
          provider.user_id,
          client.balance,
          provider.balance,
          ct.subscription_value,
          ${datetime},
          ca.next_payment_at
        FROM  r2db.services ca
          INNER JOIN r2db.services_templates ct ON ca.service_template_fk = ct.service_template_id
          INNER JOIN r2db.users client           ON ca.user_fk = client.user_id
          INNER JOIN r2db.users provider         ON ct.user_fk = provider.user_id
        WHERE
          client.plan <> 'basic' AND client.services_amount > 0 AND
          ct.subscription_value IS NOT NULL AND ${datetime} > ca.next_payment_at;
      `;

        const q2 = tx.$executeRaw`
        UPDATE r2db.services ca
        INNER JOIN r2db.services_templates ct ON ca.service_template_fk = ct.service_template_id
        INNER JOIN r2db.users client           ON ca.user_fk = client.user_id
        INNER JOIN r2db.users provider         ON ct.user_fk = provider.user_id
        SET 
          client.balance   = client.balance - ct.subscription_value,
          provider.balance = provider.balance - ct.subscription_value,
          ca.latest_payment_at = ca.next_payment_at, 
          ca.next_payment_at = # r2db.NextPaymentAt(ca.latest_payment_at, ct.subscription_frequency)
          CASE
          WHEN ct.subscription_frequency = 'minute'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 MINUTE)
          WHEN ct.subscription_frequency = 'hour'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 HOUR)
          WHEN ct.subscription_frequency = 'day'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 DAY)
          WHEN ct.subscription_frequency = 'week'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 WEEK)
          WHEN ct.subscription_frequency = 'month'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 MONTH)
          WHEN ct.subscription_frequency = 'quarter'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 QUARTER)
          WHEN ct.subscription_frequency = 'year'
          THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 YEAR)
          ELSE ct.subscription_frequency
        END
        WHERE ct.subscription_value IS NOT NULL AND ${datetime} > ca.next_payment_at;
      `;

        let [r1, r2] = await Promise.all([q1, q2]);

        /* log.debug(
          new Error('ValidationError: email address in invalid'),
          '>>>',
          r1,
          r2,
          {q: 4},
        ); */
        log.trace({r1, r2}, '>>>');
        log.debug('payment ta end');
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // optional, default defined by database configuration
      },
    );
  } catch (err) {
    log.debug('payment ta error');
    log.error(err, 'lambda_payments');
    // await prisma.$disconnect();
  }
};
