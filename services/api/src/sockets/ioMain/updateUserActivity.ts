import log from '@remrob/log';

export default async function updateUserActivity(
  userid: number,
  fingerprint: string,
  websocketKey: string,
  type: string,
) {
  if (!userid) {
    throw new Error('getObjectsByUser > userid is undefined');
  }
  try {
    if (type === 'connected') {
      /* await prisma.users_activity.create({
        data: {
          user_fk: userid,
          fingerprint,
          websocket_key: websocketKey,
          last_connected_at: new Date(),
        },
      }); */
      /* await prisma.$executeRaw`
        INSERT INTO r2db.users_activity (user_fk, fingerprint, websocket_key, last_connected_at) VALUES (${userid},${fingerprint},${websocketKey},now());
      `; */
    } else if (type === 'disconnected') {
      /* await prisma.$executeRaw`
        INSERT INTO r2db.users_activity (user_fk, fingerprint, websocket_key, last_disconnected_at)
        VALUES (${userid},${fingerprint},${websocketKey},now())
        ON DUPLICATE KEY UPDATE last_disconnected_at=now();
      `; */
    }

    /* await prisma.$executeRaw`
      UPDATE r2db.users SET user_active = 1 WHERE user_id=${userid} AND user_active = 0
    `; */
  } catch (err) {
    log.error({err}, 'updateUserActivity');
  }
  return true;
}
