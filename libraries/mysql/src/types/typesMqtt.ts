import {z} from 'zod';

export const zodListComponent = z.object({
  list: z.string(),
  items: z.array(
    z.object({
      hidden: z
        .union([
          z.object({
            id: z.string(),
          }),
          z.undefined(),
        ])
        .optional(),
      label: z.string(),
      value: z.union([z.string(), z.number()]),
    }),
  ),
});

export type TypeListComponent = z.infer<typeof zodListComponent>;

export type NativeInterface = {
  [topic: `client/${string}/button/${string}/state`]: {
    params: {
      button: string;
      state: string;
    };
    payload: string;
  };
  [topic: `client/${string}/actor/${string}/state`]: {
    params: {
      switch: string;
      state: string;
    };
    payload: string;
  };
  [topic: `client/${string}/sensor/${string}/value`]: {
    params: {
      sensor: string;
      value: number;
    };
    payload: number;
  };
  [topic: `client/${string}/list/${string}/value`]: {
    params: TypeListComponent;
    payload: TypeListComponent['items'];
  };
  [topic: `client/${string}/geoposition`]: {
    params: {
      latitude: number;
      longitude: number;
    };
    payload: {
      latitude: number;
      longitude: number;
    };
  };
};

export type NativeInterfaceTopics = keyof NativeInterface;

export type NativeInterfaceParams =
  NativeInterface[keyof NativeInterface]['params'];

// /////////////////////////////////
export type CommandFromUserToObject = {userId: number} & (
  | {command: 'reConnect'}
  | {command: 'updateButton'; buttonId: string}
  | {
      command: 'updateObjectMasterData';
      // action: 'objectMasterDataUpdate';
      data: any;
    }
  | {command: 'updateSwitch'; switchId: string; taskId: string}
  | {command: 'notifyMasterOfProvision'; childMqttClientId: string}
  | {command: 'reloadObjectData'}
);
