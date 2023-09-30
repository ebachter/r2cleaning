import {Color} from './typesColor';

export type Widget = {
  userId: number;
  widgetTemplateId: number;
  iconColor: Color;
  creatorId: number;
  name: string;
  descr: string;
  project: {
    projectId: number;
    projectName: string;
    projectColor: Color;
  } | null;
  objectsOfModels: Array<{
    modelid: number;
    icon: string;
    name: string;
    // objectData: any;
  }>;
  /* publicObjects: ; */
  privateObjects: Array<{
    mqttClientId: string;
    modelid: number;
    icon: string;
    name: string;
    registered: boolean;
    // objectData: any;
  }>;
  type?: string;
  /* project: {
    projectId: number;
    projectName: string;
    projectColor: null;
  } | null; */
};

export interface Widgets {
  [widgetId: string]: Widget;
}
