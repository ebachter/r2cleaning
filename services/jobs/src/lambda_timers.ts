import {
  TableObjectTimers,
  TableObjects,
  prisma,
  sendCommandToObject,
} from '@remrob/mysql';

export const handler = async () => {
  const res = (await prisma.$queryRaw`
    select o.mqtt_client_id, o.user_fk, ot.timer_id, ot.switch_id, ot.task_id, ot.orig_date_to
    from r2db.objects_timers ot
    inner join r2db.objects o on o.object_id = ot.object_fk
    where ot.expired = false and date_format(ot.utc_date_from, '%Y%m%d%H%i') <= date_format(now(), '%Y%m%d%H%i');
  `) as (Pick<TableObjects, 'mqtt_client_id' | 'user_fk'> &
    Pick<
      TableObjectTimers,
      'timer_id' | 'switch_id' | 'task_id' | 'orig_date_to'
    >)[];

  // console.log('>>', res);
  for (const timer of res) {
    sendCommandToObject(timer.mqtt_client_id, {
      command: 'updateSwitch',
      userId: timer.user_fk,
      switchId: timer.switch_id,
      taskId: timer.task_id,
    });
    if (new Date() >= timer.orig_date_to) {
      await prisma.objects_timers.update({
        data: {
          expired: true,
        },
        where: {
          timer_id: timer.timer_id,
        },
      });
    }
    await prisma.objects_timers_history.create({
      data: {
        timer_fk: timer.timer_id,
        processed_at: new Date(),
      },
    });
  }
};
