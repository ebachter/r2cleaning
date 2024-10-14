import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {Context} from './context';
import drizzle, {user} from '@remrob/drizzle';
import {and, eq} from 'drizzle-orm';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(({next, ctx}) => {
  if (!ctx.session || !ctx.session.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

const isAdmin = t.middleware(async ({next, ctx}) => {
  if (!ctx.session || !ctx.session.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  const adminUser = await drizzle
    .select({
      data: user.id,
    })
    .from(user)
    .where(and(eq(user.id, ctx.session.userId), eq(user.isAdmin, true)));

  if (!adminUser.length) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

export const adminProcedure = t.procedure.use(isAdmin);
