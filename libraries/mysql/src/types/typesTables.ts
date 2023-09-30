export type {
  objects,
  objects_provisions,
  objects_actions_sensors,
  objects_actions_actors,
  models,
  services,
  services_templates,
  services_templates_parties,
  services_templates_models,
  users,
  widgets,
  widgets_templates,
  contacts,
  projects,
  projects_chats,
  projects_users,
  objects_geo,
} from '../../prisma/pclient';

import type {
  objects,
  objects_provisions,
  objects_actions_sensors,
  objects_actions_actors,
  models,
  services,
  services_templates,
  services_templates_parties,
  services_templates_models,
  users,
  widgets,
  widgets_templates,
  contacts,
  projects,
  projects_chats,
  projects_users,
  objects_geo,
  objects_timers,
} from '../../prisma/pclient';

export type TableWidgets = widgets;
export type TypeContacts = contacts;
export type TableUsers = users;
export type TableWidgetsTemplates = widgets_templates;
export type ServicesTemplatesParties = services_templates_parties;
export type TypeObjectsProvisions = objects_provisions;
export type TableProjects = projects;
export type TableServices = services;
export type TableServicesTemplates = services_templates;
export type TableServicesTemplatesModels = services_templates_models;
export type TableObjectTimers = objects_timers;
