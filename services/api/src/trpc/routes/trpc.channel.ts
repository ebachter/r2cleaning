import typia from 'typia';
import {protectedProcedure, publicProcedure, router} from '../middleware';
import {observable} from '@trpc/server/observable';
import {setTimeout} from 'node:timers/promises';

export const channelRouter = router({
  onChannel: protectedProcedure
    .input(typia.createAssert<{testParam: number}>())
    .subscription(async function* () {
      for (let i = 0; i < 10; i++) {
        console.log('+++', i);
        yield `foo:${Date.now()}`;
        await setTimeout(1000);
      }
    }),
});
