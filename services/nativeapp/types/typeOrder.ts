import {RouterOutputs} from '../trpc';

export type TypeOrder = {
  date: Date;
  /* review: {
      phone: `+${number | ''}`;
    };
    smsSent: boolean; */

  orderCreated: boolean;
  price: number;
  service: {type: number; label: number};

  object: RouterOutputs['user']['loadObjects'][number];
};
