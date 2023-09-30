import {services_templates, models} from '../../prisma/pclient';
import {string, z} from 'zod';

export type TableModels = models;

export const ZodModelMappingIn = z.record(
  z.string(), // mqttTopic
  z.object({
    path: z.string(),
    sensorid: z.string(),
    actorid: z.string(),
    buttonid: z.string(),
    states: z.record(z.string(), z.string()),
    payload: z.string().nullable(),
  }),
);
export type ZodModelMappingInInfer = z.infer<typeof ZodModelMappingIn>;

export const ZodModelMappingOut = z.record(
  z.string(), //componentPath
  z.object({
    topic: string(),
    tasks: z.record(z.string(), z.string()),
    payload: z.string().optional(),
  }),
);

export type ZodModelMappingOutInfer = z.infer<typeof ZodModelMappingOut>;

export const ZodModelMappingIniCommands = z.record(
  z.string(), //componentPath
  z.object({
    topic: string(),
    tasks: z.record(z.string(), z.string()),
    payload: z.string().optional(),
  }),
);
export type ZodModelMappingIniCommandsInfer = z.infer<
  typeof ZodModelMappingIniCommands
>;

type Services_Templates = Omit<services_templates, 'export_data'> & {
  export_data: {
    webhookURL: string;
    egressData: {[key: string]: {type: 'sensor' | 'actor'}};
    ingressData: {[key: string]: {type: 'sensor' | 'actor'}};
  };
};

export type {Services_Templates};
