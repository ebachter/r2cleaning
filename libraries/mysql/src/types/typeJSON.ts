import {
  ZodModelMappingInInfer,
  ZodModelMappingIniCommandsInfer,
  ZodModelMappingOutInfer,
} from './typesModels';
import {ZodChannels, ZodObjectAlertsSensors} from './typesObjects';

export {};

declare global {
  namespace PrismaJson {
    // you can use typical basic types
    type MyType = boolean;
    // or you can use classes, interfaces, object types, etc.
    type ServicesTemplates_ActivationConfiguration = {
      elements: (
        | {input: {key: string; label: string}}
        | {textfield: {label: string; value: string}}
      )[];
    };

    type Models_InitialCommands = ZodModelMappingIniCommandsInfer;
    type Models_MappingIn = ZodModelMappingInInfer;
    type Models_MappingOut = ZodModelMappingOutInfer;

    type LogTimeline_data = {[k: string]: string};
    type Models_ExtServiceData = {webhook_url: string};
    type Models_ExtServiceMapping = {
      ingress: {
        actors: {[extTaskId: string]: {actorid: string; taskid: string}};
        sensors: string[];
      };
      egress: {actors: string[]; sensors: string[]};
    };

    type Models_JsonModelFull = {
      // name: {en: string; de: string};
      // descr: {en: string; de: string};
      buttons: {
        [buttonId: string]: {
          name: {en: string; de: string};
          states: {
            [stateId: string]: {name: {en: string; de: string}; color: string};
          };
        };
      };
      switches: {
        [switchId: string]: {
          name: {en: string; de: string};
          states: {
            [stateId: string]: {
              name: {en: string; de: string};
              color: string;
              task: {name: {en: string; de: string}};
            };
          };
        };
      };
      sensors: {
        [sensorId: string]: {
          name: {en: string; de: string};
          unit: string;
        };
      };
      lists: {
        [listId: string]: {
          name: {en: string; de: string};
        };
      };
      geo: boolean;
    };

    type Objects_Alerts = {
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
  }
}
