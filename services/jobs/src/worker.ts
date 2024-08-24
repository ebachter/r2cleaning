import log from '@remrob/log';
import '@remrob/mysql';
import '@remrob/aws';
import schedule from 'node-schedule';
import {register, setup} from '@remrob/shuttle';
// import {handler as lambda_1min} from './lambda_terminations';
// import {handler as lambda_12sec} from './lambda_inactive_user';
// import {handler as lambda_pay} from './lambda_payments';
// import {handler as lambda_services} from './lambda_services';
// import {handler as lambda_timers} from './lambda_timers';
import {Context} from 'aws-lambda';

register(async () => {
  log.info('Initializing jobs....');
  // const webPush = require('web-push');
  /* webPush.setVapidDetails(
    'mailto:contact@remrob.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  ); */

  // SERVICES
  //  lambda_services();
  //  schedule.scheduleJob({hour: 5, minute: 1}, async () => {
  //    log.info('lambda_services job');
  //    lambda_services();
  //  });

  //  // USER DEACTIVATION
  //  schedule.scheduleJob('*/15 * * * * *', async () => {
  //    // log.info('5 sec job');
  //    lambda_12sec();
  //  });

  //  // TERMINATIONS
  //  schedule.scheduleJob('* * * * *', async () => {
  //    // log.info(`1 min job`);
  //    lambda_1min();
  //  });

  //  schedule.scheduleJob('* * * * *', async () => {
  //    // log.info(`1 min job`);
  //    lambda_pay(null, {} as Context, () => null);
  //  });

  //  schedule.scheduleJob('* * * * *', async () => {
  //    // log.info(`1 min job`);
  //    // console.log('timers', new Date().toISOString());
  //    lambda_timers();
  //  });
});

setup();
