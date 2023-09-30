import {ObjectLive} from '@remrob/mysql';
import {trpcFunc} from '../trpc';
import {AsyncReturnType, ConvertObjectToString} from '../types/typesHelpers';

export const dataInitialObjectLive: ObjectLive = {
  // connected: 'no',
  switches: {},
  sensors: {},
  lists: {},
  buttons: {},
  geo: {
    latitude: null,
    longitude: null,
  },
};

type InitialObjectSettings = AsyncReturnType<
  typeof trpcFunc.appLoadObjectSettings.query
>;

export const initialObjectSettings: ConvertObjectToString<InitialObjectSettings> =
  {
    object: {
      mqtt_client_id: '',
      object_id: '',
      model_fk: '',
      object_name: '',
      created_at: '',
      modified_at: '',
      project_fk: '',
      publicly_accessible_data: '',
      features: [],
      object_configuration: '',
      connected_at: '',
      disconnected_at: '',
      models: {
        model_name_en: '',
        model_name_de: '',
        icon: '',
        json_model_full: {
          buttons: {},
          switches: {},
          sensors: {},
          lists: {},
          geo: '',
        },
      },
    },
    provisions: [],
    services: [],
  };
