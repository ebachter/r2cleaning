import {prisma} from '@remrob/mysql';
import {TypeContacts, TypeUserContacts, TableUsers} from '@remrob/mysql';
import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../middleware';

export const appContactsRouter = router({
  appContactsLoad: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session?.userId;

    const rslt = (await prisma.$queryRaw`
       WITH contacts as 
       (SELECT
          c.contact_id,
          CASE
            WHEN c.requestor_fk = ${userId} THEN c.contact_fk
            WHEN c.contact_fk = ${userId} THEN c.requestor_fk
          END as user_fk,
          c.confirm_date,
          rejected_at
        FROM r2db.contacts c
        #INNER JON r2db.users u 
        WHERE c.requestor_fk = ${userId} or c.contact_fk = ${userId})
        
        SELECT
          c.contact_id,
          c.confirm_date,
          c.rejected_at, 
          c.user_fk,
          u.username,
          u.name,
          u.bio,
          u.language,
          u.timezone,
          u.user_image_hash
        FROM contacts c
        INNER JOIN r2db.users u ON u.user_id = c.user_fk;
      `) as TypeUserContacts[];

    return rslt;
  }),

  /* appContactAdd: protectedProcedure
    .input(z.number())
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const extUserId = input;

      await prisma.$executeRaw`
    INSERT INTO r2db.contacts_requests (requestor_user_fk, confirmer_user_fk) VALUES (${userId}, ${extUserId});
  `;
    }), */

  appContactRequest: protectedProcedure
    .input(z.number())
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const extUserId = input;

      await prisma.$executeRaw`
    INSERT INTO r2db.contacts_requests (requestor_user_fk, confirmer_user_fk) VALUES (${userId}, ${extUserId});
  `;
      // yield call(postRequest, {url: '/app/contacts/request', data: {user_id}});
    }),

  appContactConfirm: protectedProcedure
    .input(z.number())
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const extUserId = input;
      await prisma.$executeRaw`
        INSERT INTO r2db.contacts(requestor_fk, contact_fk, request_date)
        SELECT requestor_user_fk, confirmer_user_fk, request_date
        FROM r2db.contacts_requests
        WHERE requestor_user_fk=${extUserId} AND confirmer_user_fk=${userId}
      `;
      await prisma.$executeRaw`
        DELETE FROM r2db.contacts_requests
        WHERE (requestor_user_fk=${extUserId} AND confirmer_user_fk=${userId}) OR (requestor_user_fk=${userId} AND confirmer_user_fk=${extUserId})
      `;
      // yield call(postRequest, {url: '/app/contacts/confirm', data: {user_id}});
    }),

  appContactDel: protectedProcedure
    .input(z.number())
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const contactId = input;
      await prisma.$executeRaw`
        DELETE FROM r2db.contacts WHERE (requestor_fk=${userId} AND contact_fk=${contactId}) OR (requestor_fk=${contactId} AND contact_fk=${userId});
      `;
      // yield call(deleteRequest, `/app/contacts/${user_id}`);
    }),

  appContactRequestRecall: protectedProcedure
    .input(z.object({confirmerUserId: z.number()}))
    .mutation(async ({ctx, input}) => {
      const {userId} = ctx.session;
      const {confirmerUserId} = input;
      await prisma.contacts_requests.deleteMany({
        where: {
          requestor_user_fk: userId,
          confirmer_user_fk: confirmerUserId,
          /* requestor_user_fk_confirmer_user_fk: {
            requestor_user_fk: userId,
          }, */
        },
      });
      // yield call(deleteRequest, `/app/contacts/request/${user_id}`);
    }),

  appContactRequestReject: protectedProcedure
    .input(z.object({requestorUserId: z.number()}))
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {requestorUserId} = input;

      await prisma.contacts_requests.deleteMany({
        where: {
          requestor_user_fk: requestorUserId,
          confirmer_user_fk: userId,
          /* requestor_user_fk_confirmer_user_fk: {
            requestor_user_fk: userId,
          }, */
        },
      });

      /* await prisma.$executeRaw`
        DELETE FROM r2db.contacts_requests WHERE (requestor_user_fk=${contactId} AND confirmer_user_fk=${userId});
      `; */
      // yield call(deleteRequest, `/app/contacts/reject/${user_id}`);
    }),

  /* app.get('/app/contact/requests', async (req, res, next) => {
        const rslt = await prisma.$queryRaw`
          SELECT contact_request_id, requestor_user_fk, request_date
          FROM r2db.contacts_requests
          WHERE confirmer_user_fk = ${res.locals.userid};
        `; */
});
