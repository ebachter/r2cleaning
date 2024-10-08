import typia from 'typia';
import {protectedProcedure, router} from '../middleware';

export const channelRouter = router({
  onChannel: protectedProcedure
    .input(typia.createAssert<{}>())
    .subscription(async function* () {
      for (let i = 0; i < 3; i++) {
        yield `foo:${Date.now()}`;
      }
    }),
});
