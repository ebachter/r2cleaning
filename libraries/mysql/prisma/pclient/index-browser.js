
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.16.2
 * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
 */
Prisma.prismaVersion = {
  client: "4.16.2",
  engine: "4bc8b6e1b66cb932731fb1bdbbc550d1e010de81"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ContactsScalarFieldEnum = {
  contact_id: 'contact_id',
  requestor_fk: 'requestor_fk',
  contact_fk: 'contact_fk',
  request_date: 'request_date',
  confirm_date: 'confirm_date',
  rejected_at: 'rejected_at'
};

exports.Prisma.ModelsScalarFieldEnum = {
  model_id: 'model_id',
  user_fk: 'user_fk',
  icon: 'icon',
  bound_contract_fk: 'bound_contract_fk',
  model_name_en: 'model_name_en',
  model_name_de: 'model_name_de',
  model_descr_en: 'model_descr_en',
  model_descr_de: 'model_descr_de',
  json_model_full: 'json_model_full',
  jsonModelFull_backup: 'jsonModelFull_backup',
  contract_type_fk: 'contract_type_fk',
  terminated_at: 'terminated_at',
  json_model_en: 'json_model_en',
  json_model_de: 'json_model_de',
  is_externally_registerable: 'is_externally_registerable',
  is_sensor_data_logging: 'is_sensor_data_logging',
  created_at: 'created_at',
  webhook_url: 'webhook_url',
  webhook_script: 'webhook_script',
  webhook_actors: 'webhook_actors',
  webhook_sensors: 'webhook_sensors',
  webhook_params___: 'webhook_params___',
  ext_service_fk: 'ext_service_fk',
  ext_service_data: 'ext_service_data',
  ext_service_mapping: 'ext_service_mapping',
  object_configuration_initial: 'object_configuration_initial',
  mapping_in: 'mapping_in',
  mapping_out: 'mapping_out',
  initial_commands: 'initial_commands'
};

exports.Prisma.ObjectsScalarFieldEnum = {
  object_id: 'object_id',
  mqtt_client_id: 'mqtt_client_id',
  mqtt_user_name: 'mqtt_user_name',
  model_fk: 'model_fk',
  keyhash: 'keyhash',
  user_fk: 'user_fk',
  object_name: 'object_name',
  email: 'email',
  created_at: 'created_at',
  modified_at: 'modified_at',
  project_fk: 'project_fk',
  publicly_accessible_data: 'publicly_accessible_data',
  features: 'features',
  live_object_online: 'live_object_online',
  free_provisioned_slaves_amount: 'free_provisioned_slaves_amount',
  is_provision_master: 'is_provision_master',
  shared_external_object_data: 'shared_external_object_data',
  object_configuration: 'object_configuration',
  alerts: 'alerts',
  connected_at: 'connected_at',
  disconnected_at: 'disconnected_at',
  terminated_at: 'terminated_at'
};

exports.Prisma.Objects_actions_actorsScalarFieldEnum = {
  object_action_switch_id: 'object_action_switch_id',
  user_fk: 'user_fk',
  actor_object_fk: 'actor_object_fk',
  actor_model_id___: 'actor_model_id___',
  actor_switch_id: 'actor_switch_id',
  actor_state_id: 'actor_state_id',
  reactor_object_fk: 'reactor_object_fk',
  reactor_model_id___: 'reactor_model_id___',
  reactor_switch_id: 'reactor_switch_id',
  reactor_task_id: 'reactor_task_id',
  created_at: 'created_at'
};

exports.Prisma.Objects_actions_sensorsScalarFieldEnum = {
  object_action_sensor_id: 'object_action_sensor_id',
  user_fk: 'user_fk',
  object_fk: 'object_fk',
  sensor_id: 'sensor_id',
  sign: 'sign',
  value: 'value',
  action_object_fk: 'action_object_fk',
  action_actor_id: 'action_actor_id',
  action_task_id: 'action_task_id',
  created_at: 'created_at'
};

exports.Prisma.Objects_geoScalarFieldEnum = {
  geo_id: 'geo_id',
  object_fk: 'object_fk'
};

exports.Prisma.Objects_provisionsScalarFieldEnum = {
  provision_id: 'provision_id',
  user_fk: 'user_fk',
  master_object_fk: 'master_object_fk',
  slave_mqtt_client_id: 'slave_mqtt_client_id',
  slave_mqtt_user_name: 'slave_mqtt_user_name',
  slave_password: 'slave_password',
  slave_model_fk: 'slave_model_fk',
  label: 'label'
};

exports.Prisma.Objects_timersScalarFieldEnum = {
  timer_id: 'timer_id',
  user_fk: 'user_fk',
  object_fk: 'object_fk',
  switch_id: 'switch_id',
  task_id: 'task_id',
  time_zone: 'time_zone',
  gmt_diff: 'gmt_diff',
  orig_date_from: 'orig_date_from',
  orig_date_to: 'orig_date_to',
  orig_time: 'orig_time',
  orig_mon: 'orig_mon',
  orig_tue: 'orig_tue',
  orig_wed: 'orig_wed',
  orig_thu: 'orig_thu',
  orig_fri: 'orig_fri',
  orig_sat: 'orig_sat',
  orig_sun: 'orig_sun',
  utc_date_from: 'utc_date_from',
  utc_date_to: 'utc_date_to',
  utc_time: 'utc_time',
  utc_mon: 'utc_mon',
  utc_tue: 'utc_tue',
  utc_wed: 'utc_wed',
  utc_thu: 'utc_thu',
  utc_fri: 'utc_fri',
  utc_sat: 'utc_sat',
  utc_sun: 'utc_sun',
  expired: 'expired'
};

exports.Prisma.Objects_tmpScalarFieldEnum = {
  object_id: 'object_id',
  modelid: 'modelid',
  objectid: 'objectid',
  key: 'key',
  user: 'user',
  userid: 'userid',
  name: 'name',
  email: 'email',
  public: 'public',
  surrogate_id: 'surrogate_id'
};

exports.Prisma.UsersScalarFieldEnum = {
  user_id: 'user_id',
  username: 'username',
  name: 'name',
  email: 'email',
  bio: 'bio',
  refreshToken: 'refreshToken',
  password: 'password',
  language: 'language',
  timezone: 'timezone',
  user_image_hash: 'user_image_hash',
  clients: 'clients',
  user_active: 'user_active',
  balance: 'balance',
  plan: 'plan',
  services_amount: 'services_amount',
  created_at: 'created_at',
  terminated_at: 'terminated_at'
};

exports.Prisma.Users_activityScalarFieldEnum = {
  user_fk: 'user_fk',
  fingerprint: 'fingerprint',
  websocket_key: 'websocket_key',
  surrogate_id: 'surrogate_id',
  last_connected_at: 'last_connected_at',
  last_disconnected_at: 'last_disconnected_at'
};

exports.Prisma.Users_newScalarFieldEnum = {
  temp_id: 'temp_id',
  email: 'email',
  password: 'password',
  name: 'name',
  language: 'language',
  timezone: 'timezone',
  created_at: 'created_at',
  attempts: 'attempts',
  surrogate_id: 'surrogate_id'
};

exports.Prisma.Users_reset_passwordScalarFieldEnum = {
  temp_id: 'temp_id',
  email: 'email',
  counter: 'counter',
  created_at: 'created_at'
};

exports.Prisma.Objects_reservationsScalarFieldEnum = {
  mqtt_client_id: 'mqtt_client_id',
  model_fk: 'model_fk',
  user_fk: 'user_fk',
  created_at: 'created_at'
};

exports.Prisma.Services_templates_partiesScalarFieldEnum = {
  service_template_party_id: 'service_template_party_id',
  service_template_fk: 'service_template_fk',
  user_fk: 'user_fk',
  role: 'role',
  activation_percent: 'activation_percent',
  subscription_percent: 'subscription_percent',
  sensor_percent: 'sensor_percent',
  object_data_access: 'object_data_access',
  object_control: 'object_control'
};

exports.Prisma.Services_templatesScalarFieldEnum = {
  service_template_id: 'service_template_id',
  user_fk: 'user_fk',
  color_avatar_background: 'color_avatar_background',
  service_template_name: 'service_template_name',
  contract_terms: 'contract_terms',
  currency: 'currency',
  contract_period_days: 'contract_period_days',
  automatic_extension: 'automatic_extension',
  activation_payment: 'activation_payment',
  subscription_value: 'subscription_value',
  subscription_frequency: 'subscription_frequency',
  add_objects_dynamically___: 'add_objects_dynamically___',
  multiple_objects___: 'multiple_objects___',
  r2comission: 'r2comission',
  export_data: 'export_data',
  activation_configuration: 'activation_configuration',
  function_code_schedule: 'function_code_schedule',
  function_code_activation: 'function_code_activation',
  created_at: 'created_at',
  updated_at: 'updated_at',
  terminated_at: 'terminated_at'
};

exports.Prisma.Services_transactionsScalarFieldEnum = {
  service_transaction_id: 'service_transaction_id',
  contract_fk: 'contract_fk',
  object_fk: 'object_fk',
  balance_from_original: 'balance_from_original',
  balance_to_original: 'balance_to_original',
  transfer_value: 'transfer_value',
  executed_at: 'executed_at',
  next_payment_at: 'next_payment_at',
  service_template_fk: 'service_template_fk',
  user_from: 'user_from',
  user_to: 'user_to',
  comment: 'comment'
};

exports.Prisma.Projects_usersScalarFieldEnum = {
  project_user_id: 'project_user_id',
  project_fk: 'project_fk',
  user_fk: 'user_fk',
  access_control: 'access_control'
};

exports.Prisma.Widgets_templatesScalarFieldEnum = {
  widget_template_id: 'widget_template_id',
  version: 'version',
  user_fk: 'user_fk',
  is_public: 'is_public',
  activation_fee: 'activation_fee',
  monthly_fee: 'monthly_fee',
  currency: 'currency',
  name_en: 'name_en',
  name_de: 'name_de',
  descr_en: 'descr_en',
  descr_de: 'descr_de',
  icon_color: 'icon_color',
  created_at: 'created_at',
  terminated_at: 'terminated_at'
};

exports.Prisma.WidgetsScalarFieldEnum = {
  widget_id: 'widget_id',
  user_fk: 'user_fk',
  widget_template_fk: 'widget_template_fk',
  object_fk: 'object_fk',
  name: 'name',
  project_fk: 'project_fk'
};

exports.Prisma.ServicesScalarFieldEnum = {
  service_id: 'service_id',
  user_fk: 'user_fk',
  object_fk: 'object_fk',
  service_template_fk: 'service_template_fk',
  contract_accepted_at: 'contract_accepted_at',
  latest_payment_at: 'latest_payment_at',
  next_payment_at: 'next_payment_at',
  latest_sensor_value: 'latest_sensor_value',
  terminated_at: 'terminated_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Widgets_templates_modelsScalarFieldEnum = {
  widgets_models_id: 'widgets_models_id',
  widget_template_fk: 'widget_template_fk',
  model_fk: 'model_fk'
};

exports.Prisma.Projects_chatsScalarFieldEnum = {
  message_id: 'message_id',
  project_fk: 'project_fk',
  text: 'text',
  user_fk: 'user_fk',
  created_at: 'created_at',
  chat_image: 'chat_image'
};

exports.Prisma.Widgets_templates_objectsScalarFieldEnum = {
  widget_object_id: 'widget_object_id',
  widget_template_fk: 'widget_template_fk',
  mqtt_client_fk: 'mqtt_client_fk',
  mqtt_client_id_reservation: 'mqtt_client_id_reservation',
  mqtt_client_id_object: 'mqtt_client_id_object'
};

exports.Prisma.Contacts_requestsScalarFieldEnum = {
  contact_request_id: 'contact_request_id',
  requestor_user_fk: 'requestor_user_fk',
  confirmer_user_fk: 'confirmer_user_fk',
  request_date: 'request_date'
};

exports.Prisma.ProjectsScalarFieldEnum = {
  project_id: 'project_id',
  name: 'name',
  color: 'color',
  descr: 'descr',
  type: 'type',
  user_fk: 'user_fk'
};

exports.Prisma.Services_templates_modelsScalarFieldEnum = {
  service_template_fk: 'service_template_fk',
  model_fk: 'model_fk',
  mapping: 'mapping',
  is_bound_service: 'is_bound_service',
  sensor_id: 'sensor_id',
  sensor_multiplicator: 'sensor_multiplicator'
};

exports.Prisma.Objects_timers_historyScalarFieldEnum = {
  sid: 'sid',
  timer_fk: 'timer_fk',
  processed_at: 'processed_at'
};

exports.Prisma.Log_cloud_storeScalarFieldEnum = {
  cloud_store_id: 'cloud_store_id',
  user_id: 'user_id',
  object_id: 'object_id',
  model_id: 'model_id',
  mqtt_client_id: 'mqtt_client_id',
  data_store: 'data_store',
  created_at: 'created_at',
  created_iso: 'created_iso',
  value: 'value',
  duplicate2016: 'duplicate2016',
  id: 'id',
  key: 'key',
  timestamp: 'timestamp',
  filters: 'filters',
  v: 'v',
  date: 'date'
};

exports.Prisma.Log_objects_sensorsScalarFieldEnum = {
  log_objects_sensors_id: 'log_objects_sensors_id',
  user_id: 'user_id',
  model_id: 'model_id',
  object_id: 'object_id',
  sensor_id: 'sensor_id',
  value: 'value',
  inserted_at: 'inserted_at'
};

exports.Prisma.Log_timelineScalarFieldEnum = {
  timeline_id: 'timeline_id',
  user_fk: 'user_fk',
  operation: 'operation',
  data: 'data',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.objects_actions_sensors_sign = {
  greater: 'greater',
  less: 'less'
};

exports.users_language = {
  en: 'en',
  de: 'de'
};

exports.users_plan = {
  basic: 'basic',
  professional: 'professional'
};

exports.users_new_language = {
  en: 'en',
  de: 'de'
};

exports.services_templates_parties_role = {
  servicer: 'servicer',
  provider: 'provider',
  insurer: 'insurer',
  producer: 'producer'
};

exports.services_templates_currency = {
  EUR: 'EUR',
  USD: 'USD'
};

exports.services_templates_subscription_frequency = {
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year'
};

exports.widgets_templates_currency = {
  eur: 'eur',
  usd: 'usd'
};

exports.projects_type = {
  private: 'private',
  public: 'public'
};

exports.log_timeline_operation = {
  userRegistration: 'userRegistration',
  pairingSuccess: 'pairingSuccess',
  objectOfflineAlert: 'objectOfflineAlert',
  sensorLimitReached: 'sensorLimitReached'
};

exports.Prisma.ModelName = {
  contacts: 'contacts',
  models: 'models',
  objects: 'objects',
  objects_actions_actors: 'objects_actions_actors',
  objects_actions_sensors: 'objects_actions_sensors',
  objects_geo: 'objects_geo',
  objects_provisions: 'objects_provisions',
  objects_timers: 'objects_timers',
  objects_tmp: 'objects_tmp',
  users: 'users',
  users_activity: 'users_activity',
  users_new: 'users_new',
  users_reset_password: 'users_reset_password',
  objects_reservations: 'objects_reservations',
  services_templates_parties: 'services_templates_parties',
  services_templates: 'services_templates',
  services_transactions: 'services_transactions',
  projects_users: 'projects_users',
  widgets_templates: 'widgets_templates',
  widgets: 'widgets',
  services: 'services',
  widgets_templates_models: 'widgets_templates_models',
  projects_chats: 'projects_chats',
  widgets_templates_objects: 'widgets_templates_objects',
  contacts_requests: 'contacts_requests',
  projects: 'projects',
  services_templates_models: 'services_templates_models',
  objects_timers_history: 'objects_timers_history',
  log_cloud_store: 'log_cloud_store',
  log_objects_sensors: 'log_objects_sensors',
  log_timeline: 'log_timeline'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
