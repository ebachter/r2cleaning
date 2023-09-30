import {TableModels} from './typesModels';
import {z} from 'zod';
import {objects} from '../../prisma/pclient';
import {TableProjects} from './typesTables';

export type ObjectLive = {
  // connected: 'yes' | 'no'; // boolean;
  switches: {
    [switchId: string]: string;
  };
  sensors: {
    [sensorId: string]: number | null;
  };
  lists: {
    [listId: string]: Array<{
      hidden?: {id: string};
      label: string;
      value: string | number;
    }>;
  };
  buttons: {
    [buttonId: string]: string;
  };
  geo: {latitude: number | null; longitude: number | null};
};

export type ObjectsLive = {[objectId: string]: ObjectLive};

export type TableObjects = Omit<
  objects,
  | 'publicly_accessible_data'
  | 'alerts'
  | 'models'
  | 'object_configuration'
  | 'features'
> & {
  projects: Pick<TableProjects, 'name' | 'color' | 'project_id'> | null;
  object_configuration: any;
  models: Pick<TableModels, 'json_model_full' | 'icon'>;
  // live: ObjectLive;
  publicly_accessible_data: {switches: string[]; sensors: string[]} | null;
  alerts: TypeObjectAlerts;
  features: string[];
};

/* export interface TableObjects {
  [objectId: string]: TableObject;
} */

const ZodChannelsSensors = z.object({
  email: z.boolean(),
  push: z.boolean(),
});

export const zodObjectAlertsSensors = z.record(
  z.string(), // sensorId
  z.object({
    greater: z.object({
      value: z.number(),
      channels: ZodChannelsSensors,
    }),
    less: z.object({
      value: z.number(),
      channels: ZodChannelsSensors,
    }),
  }),
);

export type ZodObjectAlertsSensors = z.infer<typeof zodObjectAlertsSensors>;

export const zodChannels = z.set(z.literal('email').or(z.literal('push')));

export type ZodChannels = z.infer<typeof zodChannels>;

export type TypeObjectAlerts = {
  onoff: {
    onConnect: {email: boolean; push: boolean};
    onDisconnect: {email: boolean; push: boolean};
  };
  switches: {
    [switchId_stateId: string]: ZodChannels;
  };
  buttons: {
    [buttonId_stateId: string]: ZodChannels;
  };
  sensors: ZodObjectAlertsSensors /* {
    [sensorId: string]: {
      greater: {value: number; channels: {email: boolean; push: boolean}};
      less: {value: number; channels: {email: boolean; push: boolean}};
    };
  }; */;
};
