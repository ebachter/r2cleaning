import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import type {TableModels} from '@remrob/mysql';

export const searchModelsRouter = router({
  searchModels: protectedProcedure
    .input(z.object({queryString: z.string().nullable()}))
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {queryString} = input;
      const qs = queryString ? parseInt(queryString) : '';

      const rows = (await prisma.$queryRaw`
          SELECT model_id modelId, ${Prisma.raw(
            `json_model_full->>'$.name.${lang}'`,
          )} as name, ${Prisma.raw(
        `json_model_full->>'$.descr.${lang}'`,
      )} as descr, icon
          FROM r2db.models 
          WHERE is_externally_registerable = 1 
            ${
              queryString !== 'null'
                ? Prisma.sql`
                    AND ((JSON_EXTRACT(json_model_full, ${`$.name.${lang}`})) like ${`%${queryString}%`}
                    OR model_id  = ${qs})
                    `
                : Prisma.sql`AND user_fk=${userId}`
            }
          LIMIT 10
        `) as {modelId: number; name: string; descr: string; icon: string}[];
      return rows;
    }),

  searchModel: protectedProcedure
    .input(z.number().int())
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const modelId = input;

      const data = (await prisma.$queryRaw`
        SELECT u.username userName, m.json_model_full as model, m.icon, m.model_name_en, m.model_name_de
        FROM r2db.models m, r2db.users u
        WHERE (m.is_externally_registerable = 1 OR u.user_id = ${userId}) AND u.user_id=m.user_fk AND m.model_id = ${modelId};
      `) as ({
        userName: string;
        model: TableModels['json_model_full'];
        icon: string;
      } & Pick<
        TableModels,
        'model_name_en' | 'model_name_de' | 'model_descr_en' | 'model_descr_de'
      >)[];

      return data[0];
    }),
});
