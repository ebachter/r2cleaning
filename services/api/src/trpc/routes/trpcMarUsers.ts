import {string, z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure, publicProcedure} from '../middleware';
import {users} from '@remrob/mysql';

export const searchUsersRouter = router({
  searchUsers: protectedProcedure
    // The input is unknown at this time.
    // A client could have sent us anything
    // so we won't assume a certain data type.
    .input(z.object({queryString: z.string().nullable()}))
    .query(async ({ctx, input}) => {
      const userId = ctx.session.userId;
      const {queryString} = input;

      const data = (await prisma.$queryRaw`
        with contacts as (
        select case when c.requestor_fk = ${userId} then c.contact_fk else c.requestor_fk end other_user_id 
        from r2db.contacts c
        where c.requestor_fk = ${userId} or c.contact_fk = ${userId}
        ),
        contacts_requests as (
          select case when c.requestor_user_fk = ${userId} then c.confirmer_user_fk else c.requestor_user_fk end other_user_id,
          c.requestor_user_fk
          from r2db.contacts_requests c
          where c.requestor_user_fk = ${userId} or c.confirmer_user_fk = ${userId}
        )
        SELECT u.user_id, u.username, u.name, u.user_image_hash, c.other_user_id, cr.other_user_id,cr.requestor_user_fk,
          case
            when c.other_user_id is not null then 'contact'
            when cr.other_user_id is null then 'notconnected'
            when cr.requestor_user_fk<>cr.other_user_id then 'sent' 
            else 'pending' end as status
        FROM r2db.users u
        ${
          queryString !== 'null'
            ? Prisma.sql`
            left join contacts_requests cr on cr.other_user_id = u.user_id
            LEFT OUTER JOIN contacts c ON c.other_user_id = u.user_id
            WHERE u.name like ${`%${queryString}%`}
            LIMIT 10;
          `
            : Prisma.sql`
            left JOIN contacts c ON c.other_user_id = u.user_id
            left join contacts_requests cr on cr.other_user_id = u.user_id
            where c.other_user_id is not null or cr.other_user_id is not null;
          `
        }
      `) as (Pick<
        users,
        'user_id' | 'username' | 'name' | 'user_image_hash'
      > & {
        status: 'pending' | 'sent' | 'contact' | 'notconnected';
      })[];

      return data;
    }),

  searchUser: protectedProcedure
    .input(
      z
        .object({
          profileId: z.number(),
          userName: z.string(),
        })
        .partial()
        .refine(
          (data) => data.profileId || data.userName,
          'Either profileId or userName should be filled in.',
        ),
    )
    .query(async ({ctx, input}) => {
      const userId = ctx.session.userId;
      const {profileId, userName} = input;

      const queryBy = userName ? 'username' : 'userid';

      const extUserData = await prisma.users.findUniqueOrThrow({
        select: {
          user_id: true,
          email: true,
          username: true,
          name: true,
          language: true,
          timezone: true,
          user_image_hash: true,
          bio: true,
        },
        where: {
          [queryBy]: profileId || userName,
        },
      });

      const extUserId = extUserData.user_id;

      let contactStatus: 'free' | 'contact' | 'pending' | 'requested';
      contactStatus = 'free';
      // 1. Check if is already contact
      const contactData = await prisma.contacts.findFirst({
        where: {
          OR: [
            {
              AND: [
                {
                  requestor_fk: userId,
                  contact_fk: extUserId,
                },
              ],
            },
            {
              AND: [
                {
                  requestor_fk: extUserId,
                  contact_fk: userId,
                },
              ],
            },
          ],
        },
      });

      if (contactData) contactStatus = 'contact';
      if (!contactData) {
        const contactRequestData = await prisma.contacts_requests.findFirst({
          select: {
            contact_request_id: true,
            confirmer_user_fk: true,
            requestor_user_fk: true,
          },
          where: {
            OR: [
              {
                AND: [
                  {
                    confirmer_user_fk: extUserId,
                    requestor_user_fk: userId,
                  },
                ],
              },
              {
                AND: [
                  {
                    confirmer_user_fk: userId,
                    requestor_user_fk: extUserId,
                  },
                ],
              },
            ],
          },
        });

        if (contactRequestData?.confirmer_user_fk === userId)
          contactStatus = 'pending';
        if (contactRequestData?.requestor_user_fk === userId)
          contactStatus = 'requested';
      }

      const publicObjects = (await prisma.$queryRaw`
        SELECT o.object_id, o.object_name, o.features, o.live_object_online online, m.icon
        FROM r2db.objects o
        INNER JOIN r2db.models m ON m.model_id=o.model_fk
        where o.user_fk = ${extUserId} and o.publicly_accessible_data is not null;
      `) as {
        object_id: number;
        object_name: string;
        features: string[];
        online: 0 | 1;
        icon: string;
      }[];

      return {...extUserData, publicObjects, status: contactStatus};
    }),
});
