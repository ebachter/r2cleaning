export type SearchUser = {
  userId: number;
  userName: string;
  name: string;
  userImageHash: string;
  status: 'none' | 'pending' | 'sent' | 'contact';
};

export type Search = {
  objects: {objectId: number}[];
  widgets: {widgetId: number}[];
  models: {modelId: number}[];
  services: {serviceId: number}[];
  users: SearchUser[];
};
