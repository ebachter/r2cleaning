/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/ `r2db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `r2db`;
DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `requestor_fk` int NOT NULL,
  `contact_fk` int NOT NULL,
  `request_date` timestamp NOT NULL,
  `confirm_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rejected_at` datetime DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  UNIQUE KEY `uq_contact` (`requestor_fk`,`contact_fk`),
  KEY `fk_contacts2_user_id` (`contact_fk`),
  KEY `fk_contacts_user_id` (`requestor_fk`),
  CONSTRAINT `FK_2693190e5a99e58e7ac1d3f0914` FOREIGN KEY (`contact_fk`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_fd5273cb90cd212a74124e38df5` FOREIGN KEY (`requestor_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `contacts_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts_requests` (
  `contact_request_id` int NOT NULL AUTO_INCREMENT,
  `requestor_user_fk` int NOT NULL,
  `confirmer_user_fk` int NOT NULL,
  `request_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_request_id`),
  UNIQUE KEY `uq_network_request` (`requestor_user_fk`,`confirmer_user_fk`),
  KEY `network_confirmer_fk` (`confirmer_user_fk`),
  CONSTRAINT `FK_7761396d6951d8b4d4e155b897b` FOREIGN KEY (`requestor_user_fk`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_7f217d86ceb23e8ccd51312d956` FOREIGN KEY (`confirmer_user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `log_cloud_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_cloud_store` (
  `cloud_store_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL,
  `object_id` int DEFAULT NULL,
  `model_id` int NOT NULL,
  `mqtt_client_id` varchar(200) NOT NULL,
  `data_store` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `created_iso` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `value` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `duplicate2016` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `_id` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `key` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `timestamp` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `filters` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `__v` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `date` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cloud_store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `log_objects_sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_objects_sensors` (
  `log_objects_sensors_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `model_id` int NOT NULL,
  `object_id` int NOT NULL,
  `sensor_id` varchar(45) NOT NULL,
  `value` varchar(45) DEFAULT NULL,
  `inserted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_objects_sensors_id`)
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `log_timeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_timeline` (
  `timeline_id` int NOT NULL DEFAULT '0',
  `user_fk` int NOT NULL,
  `operation` enum('userRegistration','pairingSuccess','objectOfflineAlert','sensorLimitReached') NOT NULL,
  `data` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`timeline_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `model_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int NOT NULL,
  `icon` varchar(100) NOT NULL DEFAULT 'no_icon.png',
  `bound_contract_fk` int DEFAULT NULL,
  `model_name_en` varchar(100) NOT NULL,
  `model_name_de` varchar(100) NOT NULL,
  `model_descr_en` varchar(300) DEFAULT NULL,
  `model_descr_de` varchar(300) DEFAULT NULL,
  `json_model_full` json NOT NULL,
  `jsonModelFull_backup` json DEFAULT NULL,
  `contract_type_fk` int DEFAULT NULL,
  `terminated_at` datetime DEFAULT NULL,
  `json_model_en` json DEFAULT NULL,
  `json_model_de` json DEFAULT NULL,
  `is_externally_registerable` tinyint NOT NULL DEFAULT '0',
  `is_sensor_data_logging` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `webhook_url` varchar(250) DEFAULT NULL,
  `webhook_script` varchar(10000) DEFAULT NULL,
  `webhook_actors` tinyint NOT NULL DEFAULT '0',
  `webhook_sensors` tinyint NOT NULL DEFAULT '0',
  `webhook_params___` json DEFAULT NULL,
  `ext_service_fk` int DEFAULT NULL,
  `ext_service_data` json DEFAULT NULL,
  `ext_service_mapping` json DEFAULT NULL,
  `object_configuration_initial` json DEFAULT NULL,
  `mapping_in` json NOT NULL,
  `mapping_out` json NOT NULL,
  `initial_commands` json NOT NULL,
  PRIMARY KEY (`model_id`),
  KEY `fk_mdls_userid_idx` (`user_fk`),
  KEY `fk_models_bound_conract_idx` (`bound_contract_fk`),
  KEY `fk_models_contract_type_id_idx` (`contract_type_fk`),
  CONSTRAINT `FK_2f1462c9f471ce60326999bf976` FOREIGN KEY (`bound_contract_fk`) REFERENCES `services_templates` (`service_template_id`),
  CONSTRAINT `FK_61e70948d8294504521eebad90b` FOREIGN KEY (`contract_type_fk`) REFERENCES `services_templates` (`service_template_id`),
  CONSTRAINT `FK_bf435fe5809dbabc5d72775ab35` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1087 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects` (
  `object_id` int NOT NULL AUTO_INCREMENT,
  `mqtt_client_id` varchar(200) NOT NULL,
  `mqtt_user_name` varchar(100) NOT NULL,
  `model_fk` int NOT NULL,
  `keyhash` varchar(64) NOT NULL,
  `user_fk` int NOT NULL,
  `object_name` varchar(100) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `project_fk` int DEFAULT NULL,
  `publicly_accessible_data` json DEFAULT NULL,
  `features` json DEFAULT NULL,
  `live_object_online` tinyint NOT NULL DEFAULT '0',
  `free_provisioned_slaves_amount` int DEFAULT NULL,
  `is_provision_master` tinyint NOT NULL DEFAULT '0',
  `shared_external_object_data` json NOT NULL,
  `object_configuration` json DEFAULT NULL,
  `alerts` json DEFAULT NULL,
  `connected_at` datetime DEFAULT NULL,
  `disconnected_at` datetime DEFAULT NULL,
  `terminated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  UNIQUE KEY `uq_objects_ix` (`model_fk`,`mqtt_client_id`) /*!80000 INVISIBLE */,
  UNIQUE KEY `uq_objects_mqttclientid` (`mqtt_client_id`),
  KEY `fk_topicid_idx` (`project_fk`),
  KEY `ix_Objects_modelid` (`model_fk`),
  KEY `ix_Objects_userid` (`user_fk`),
  CONSTRAINT `FK_9ab249eab34d1979319f06b6120` FOREIGN KEY (`project_fk`) REFERENCES `projects` (`project_id`) ON DELETE SET NULL,
  CONSTRAINT `FK_a926c99bb40f7c679c4e09bcacf` FOREIGN KEY (`model_fk`) REFERENCES `models` (`model_id`),
  CONSTRAINT `FK_b2b6d9fe85086f626331cf83aa1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=418 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_actions_actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_actions_actors` (
  `object_action_switch_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int DEFAULT NULL,
  `actor_object_fk` int NOT NULL,
  `actor_model_id___` int DEFAULT NULL,
  `actor_switch_id` varchar(45) NOT NULL,
  `actor_state_id` varchar(45) NOT NULL,
  `reactor_object_fk` int NOT NULL,
  `reactor_model_id___` int DEFAULT NULL,
  `reactor_switch_id` varchar(45) NOT NULL,
  `reactor_task_id` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`object_action_switch_id`),
  UNIQUE KEY `gridid_UNIQUE` (`object_action_switch_id`),
  KEY `fk_object_action_switch2_idx` (`reactor_object_fk`),
  KEY `fk_object_action_switch1` (`actor_object_fk`),
  CONSTRAINT `fk_object_action_switch1` FOREIGN KEY (`actor_object_fk`) REFERENCES `objects` (`object_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_object_action_switch2` FOREIGN KEY (`reactor_object_fk`) REFERENCES `objects` (`object_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_actions_sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_actions_sensors` (
  `object_action_sensor_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int NOT NULL,
  `object_fk` int NOT NULL,
  `sensor_id` varchar(45) NOT NULL,
  `sign` enum('greater','less') NOT NULL,
  `value` int NOT NULL,
  `action_object_fk` int NOT NULL,
  `action_actor_id` varchar(45) NOT NULL,
  `action_task_id` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`object_action_sensor_id`),
  UNIQUE KEY `limitid_UNIQUE` (`object_action_sensor_id`),
  UNIQUE KEY `senor_action_uq` (`object_fk`,`sensor_id`,`sign`),
  KEY `obj_fns_actn_obj_idx` (`action_object_fk`),
  KEY `obj_fns_uid` (`user_fk`),
  CONSTRAINT `FK_6f758d907c60597351128b901a1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_d76d6db56008abd8d2424ba94c5` FOREIGN KEY (`object_fk`) REFERENCES `objects` (`object_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_geo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_geo` (
  `geo_id` int NOT NULL AUTO_INCREMENT,
  `object_fk` int NOT NULL,
  `geo` point NOT NULL,
  PRIMARY KEY (`geo_id`),
  UNIQUE KEY `object_fk_UNIQUE` (`object_fk`),
  UNIQUE KEY `IDX_101f7bc75995aa72e748470a9b` (`object_fk`),
  UNIQUE KEY `REL_101f7bc75995aa72e748470a9b` (`object_fk`),
  KEY `fk_objects_geo_user_id` (`object_fk`),
  CONSTRAINT `FK_101f7bc75995aa72e748470a9b1` FOREIGN KEY (`object_fk`) REFERENCES `objects` (`object_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=927 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_provisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_provisions` (
  `provision_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int NOT NULL,
  `master_object_fk` int NOT NULL,
  `slave_mqtt_client_id` varchar(200) NOT NULL,
  `slave_mqtt_user_name` varchar(100) DEFAULT NULL,
  `slave_password` varchar(200) NOT NULL,
  `slave_model_fk` int NOT NULL,
  `label` varchar(45) NOT NULL,
  PRIMARY KEY (`provision_id`),
  UNIQUE KEY `uq_provision_mqttClientId` (`slave_mqtt_client_id`),
  KEY `fk_provision_object_id` (`master_object_fk`),
  KEY `fk_provision_user_id` (`user_fk`),
  KEY `fk_obj_provisions_modelid_idx` (`slave_model_fk`),
  CONSTRAINT `FK_482847348c8062fcd0b6e75d5ef` FOREIGN KEY (`master_object_fk`) REFERENCES `objects` (`object_id`),
  CONSTRAINT `FK_be0bec737ccd02a049c6d8f0a45` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_obj_provisions_modelid` FOREIGN KEY (`slave_model_fk`) REFERENCES `models` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_reservations` (
  `mqtt_client_id` varchar(200) NOT NULL,
  `model_fk` int NOT NULL,
  `user_fk` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mqtt_client_id`),
  KEY `fk_reservations_modelid` (`model_fk`),
  KEY `fk_reservations_userid` (`user_fk`),
  CONSTRAINT `fk_reservations_modelid` FOREIGN KEY (`model_fk`) REFERENCES `models` (`model_id`),
  CONSTRAINT `fk_reservations_userid` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_timers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_timers` (
  `timer_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int DEFAULT NULL,
  `object_fk` int NOT NULL,
  `switch_id` varchar(45) NOT NULL,
  `task_id` varchar(45) NOT NULL,
  `time_zone` varchar(100) NOT NULL,
  `gmt_diff` int NOT NULL,
  `orig_date_from` datetime NOT NULL,
  `orig_date_to` datetime NOT NULL,
  `orig_time` time NOT NULL,
  `orig_mon` tinyint(1) NOT NULL,
  `orig_tue` tinyint(1) NOT NULL,
  `orig_wed` tinyint(1) NOT NULL,
  `orig_thu` tinyint(1) NOT NULL,
  `orig_fri` tinyint(1) NOT NULL,
  `orig_sat` tinyint(1) NOT NULL,
  `orig_sun` tinyint(1) NOT NULL,
  `utc_date_from` varchar(40) NOT NULL,
  `utc_date_to` varchar(40) NOT NULL,
  `utc_time` time DEFAULT NULL,
  `utc_mon` tinyint(1) DEFAULT NULL,
  `utc_tue` tinyint(1) DEFAULT NULL,
  `utc_wed` tinyint(1) DEFAULT NULL,
  `utc_thu` tinyint(1) DEFAULT NULL,
  `utc_fri` tinyint(1) DEFAULT NULL,
  `utc_sat` tinyint(1) DEFAULT NULL,
  `utc_sun` tinyint(1) DEFAULT NULL,
  `expired` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`timer_id`),
  UNIQUE KEY `uq_timer` (`object_fk`,`orig_date_from`),
  KEY `ix_virtual_col` (`utc_date_from`) /*!80000 INVISIBLE */,
  KEY `fk_timer_user_fk` (`user_fk`),
  CONSTRAINT `fk_timer_object_id` FOREIGN KEY (`object_fk`) REFERENCES `objects` (`object_id`),
  CONSTRAINT `fk_timer_user_fk` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_timers_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_timers_history` (
  `sid` int NOT NULL AUTO_INCREMENT,
  `timer_fk` int NOT NULL,
  `processed_at` datetime NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `fk_timer_history_timerId` (`timer_fk`),
  CONSTRAINT `fk_timer_history_timerId` FOREIGN KEY (`timer_fk`) REFERENCES `objects_timers` (`timer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `objects_tmp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_tmp` (
  `object_id` varchar(45) NOT NULL,
  `modelid` int NOT NULL,
  `objectid` int NOT NULL,
  `key` varchar(256) NOT NULL,
  `user` varchar(45) NOT NULL,
  `userid` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '1',
  `surrogate_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`surrogate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `color` varchar(45) NOT NULL,
  `descr` varchar(200) NOT NULL,
  `type` enum('private','public') NOT NULL DEFAULT 'private',
  `user_fk` int NOT NULL,
  PRIMARY KEY (`project_id`),
  KEY `fk_user_id` (`user_fk`),
  CONSTRAINT `FK_9d915a28f25043fa28e73e1b52f` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `projects_chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects_chats` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `project_fk` int NOT NULL,
  `text` varchar(200) NOT NULL,
  `user_fk` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chat_image` longtext,
  PRIMARY KEY (`message_id`),
  KEY `fk_chat_topicid_idx` (`project_fk`),
  KEY `fk_chat_user_id` (`user_fk`),
  CONSTRAINT `FK_badb96f0396670bf43c5553463f` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_c610d0791e0092a9caff2c1b058` FOREIGN KEY (`project_fk`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `projects_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects_users` (
  `project_user_id` int NOT NULL AUTO_INCREMENT,
  `project_fk` int NOT NULL,
  `user_fk` int NOT NULL,
  `access_control` tinyint(1) NOT NULL,
  PRIMARY KEY (`project_user_id`),
  KEY `fk_topic_user_id_idx` (`project_fk`),
  KEY `fk_topic_user_id_idx1` (`user_fk`),
  CONSTRAINT `FK_6f9b5aec6418fb30495fb627438` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_904fac823264da0db66dffc3233` FOREIGN KEY (`project_fk`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int NOT NULL,
  `object_fk` int NOT NULL,
  `service_template_fk` int NOT NULL,
  `contract_accepted_at` datetime DEFAULT NULL COMMENT 'acceptance_ts',
  `latest_payment_at` datetime DEFAULT NULL,
  `next_payment_at` datetime DEFAULT NULL,
  `latest_sensor_value` decimal(12,2) DEFAULT NULL,
  `terminated_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_id`),
  UNIQUE KEY `uq_contracts` (`object_fk`,`service_template_fk`),
  KEY `fk_contract_type_id_idx` (`service_template_fk`),
  KEY `fk_contracts_users_userid_idx` (`user_fk`),
  CONSTRAINT `FK_5e82f70712c7fd9548c5071aadd` FOREIGN KEY (`object_fk`) REFERENCES `objects` (`object_id`),
  CONSTRAINT `FK_77fa55618d4f957cd3a138afad1` FOREIGN KEY (`service_template_fk`) REFERENCES `services_templates` (`service_template_id`),
  CONSTRAINT `FK_9c875624c6889a9d927df01b4b4` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `services_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_templates` (
  `service_template_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int NOT NULL,
  `color_avatar_background` varchar(15) NOT NULL,
  `service_template_name` varchar(45) NOT NULL,
  `contract_terms` varchar(500) NOT NULL,
  `currency` enum('EUR','USD') DEFAULT NULL,
  `contract_period_days` int DEFAULT NULL COMMENT 'Minimum duration of the contract',
  `automatic_extension` tinyint NOT NULL DEFAULT '0' COMMENT 'If not cancelled, the contract will automatically extended for the next contract term',
  `activation_payment` decimal(10,2) NOT NULL DEFAULT '0.00',
  `subscription_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `subscription_frequency` enum('minute','hour','day','week','month','quarter','year') DEFAULT NULL,
  `add_objects_dynamically___` tinyint NOT NULL DEFAULT '0',
  `multiple_objects___` tinyint NOT NULL DEFAULT '0',
  `r2comission` decimal(3,2) NOT NULL DEFAULT '1.10',
  `export_data` json DEFAULT NULL,
  `activation_configuration` json NOT NULL,
  `function_code_schedule` text,
  `function_code_activation` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `terminated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`service_template_id`),
  KEY `fk_conract_userid` (`user_fk`),
  CONSTRAINT `FK_bae4b1b44d600f9e3043cdff973` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `services_templates_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_templates_models` (
  `service_template_fk` int NOT NULL,
  `model_fk` int NOT NULL,
  `mapping` json NOT NULL,
  `is_bound_service` tinyint(1) NOT NULL DEFAULT '0',
  `sensor_id` varchar(45) DEFAULT NULL,
  `sensor_multiplicator` decimal(8,2) NOT NULL DEFAULT '0.00',
  UNIQUE KEY `uq_services_templates_models` (`service_template_fk`,`model_fk`),
  KEY `fk_models` (`model_fk`),
  CONSTRAINT `fk_models` FOREIGN KEY (`model_fk`) REFERENCES `models` (`model_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_services_templates` FOREIGN KEY (`service_template_fk`) REFERENCES `services_templates` (`service_template_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `services_templates_parties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_templates_parties` (
  `service_template_party_id` int NOT NULL AUTO_INCREMENT,
  `service_template_fk` int NOT NULL,
  `user_fk` int NOT NULL,
  `role` enum('servicer','provider','insurer','producer') NOT NULL,
  `activation_percent` decimal(5,2) DEFAULT NULL,
  `subscription_percent` decimal(5,2) DEFAULT NULL,
  `sensor_percent` decimal(5,2) DEFAULT NULL,
  `object_data_access` tinyint NOT NULL DEFAULT '0',
  `object_control` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`service_template_party_id`),
  KEY `fk_contract_type_parties__contract_type_id_idx` (`service_template_fk`),
  KEY `fk_contract_type_parties__users_userid_idx` (`user_fk`),
  CONSTRAINT `FK_3b0741055060dd737b6d1c0316f` FOREIGN KEY (`service_template_fk`) REFERENCES `services_templates` (`service_template_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_fde7effbc14fd9a276f99095899` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `services_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_transactions` (
  `service_transaction_id` int NOT NULL AUTO_INCREMENT,
  `contract_fk` int NOT NULL,
  `object_fk` int NOT NULL,
  `balance_from_original` int NOT NULL,
  `balance_to_original` int NOT NULL,
  `transfer_value` decimal(10,2) NOT NULL,
  `executed_at` datetime NOT NULL,
  `next_payment_at` datetime DEFAULT NULL,
  `service_template_fk` int NOT NULL,
  `user_from` int NOT NULL,
  `user_to` int NOT NULL,
  `comment` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`service_transaction_id`),
  KEY `contracts_transactions_FK` (`contract_fk`),
  CONSTRAINT `FK_08c7e38afebcc507085267dfb06` FOREIGN KEY (`contract_fk`) REFERENCES `services` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82289 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(80) NOT NULL,
  `bio` varchar(500) NOT NULL DEFAULT 'I am the champion of robotics',
  `refreshToken` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `language` enum('en','de') NOT NULL,
  `timezone` varchar(100) NOT NULL DEFAULT 'UTC',
  `user_image_hash` varchar(45) NOT NULL,
  `clients` json DEFAULT NULL,
  `user_active` tinyint NOT NULL DEFAULT '1',
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `plan` enum('basic','professional') NOT NULL DEFAULT 'basic',
  `services_amount` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `terminated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `userid_UNIQUE` (`username`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_activity` (
  `user_fk` int NOT NULL,
  `fingerprint` varchar(45) DEFAULT NULL,
  `websocket_key` varchar(100) DEFAULT NULL,
  `surrogate_id` int NOT NULL AUTO_INCREMENT,
  `last_connected_at` datetime DEFAULT NULL,
  `last_disconnected_at` datetime DEFAULT NULL,
  PRIMARY KEY (`surrogate_id`),
  UNIQUE KEY `websocket_key_unique_ix` (`websocket_key`),
  UNIQUE KEY `IDX_8518d71dc620c40cd136934838` (`websocket_key`),
  KEY `users_activity_userfk_ix` (`user_fk`),
  CONSTRAINT `FK_cccbc81399f9aeaba4407dcbc38` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44658 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_new` (
  `temp_id` varchar(80) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `language` enum('en','de') NOT NULL,
  `timezone` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attempts` int NOT NULL DEFAULT '0',
  `surrogate_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`surrogate_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `userid_UNIQUE` (`temp_id`),
  UNIQUE KEY `IDX_cbc3b9b5fdfac34af81deea841` (`temp_id`),
  UNIQUE KEY `IDX_bfca748f04c4f27660d2aa7d84` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users_reset_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_reset_password` (
  `temp_id` varchar(50) NOT NULL,
  `email` varchar(80) NOT NULL,
  `counter` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `tempid_UNIQUE` (`temp_id`),
  UNIQUE KEY `IDX_c37329ea19c5896b274985b376` (`temp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `widgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `widgets` (
  `widget_id` int NOT NULL AUTO_INCREMENT,
  `user_fk` int NOT NULL,
  `widget_template_fk` int NOT NULL,
  `object_fk` varchar(45) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `project_fk` int DEFAULT NULL,
  PRIMARY KEY (`widget_id`),
  UNIQUE KEY `id_UNIQUE` (`widget_id`),
  UNIQUE KEY `widget_user_unique` (`user_fk`,`widget_template_fk`),
  KEY `fk_widgetid_idx` (`widget_template_fk`),
  KEY `ix_Wbookmark_userid` (`user_fk`),
  KEY `FK_widget_project_idx` (`project_fk`),
  CONSTRAINT `FK_44d42f374c2dfabadde070fa93c` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_844284939930e083fdb4a9e6108` FOREIGN KEY (`widget_template_fk`) REFERENCES `widgets_templates` (`widget_template_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_widget_project` FOREIGN KEY (`project_fk`) REFERENCES `projects` (`project_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `widgets_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `widgets_templates` (
  `widget_template_id` int NOT NULL AUTO_INCREMENT,
  `version` int NOT NULL DEFAULT '1',
  `user_fk` int NOT NULL DEFAULT '0',
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `activation_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `monthly_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `currency` enum('eur','usd') DEFAULT NULL,
  `name_en` varchar(45) NOT NULL,
  `name_de` varchar(45) NOT NULL,
  `descr_en` varchar(200) NOT NULL,
  `descr_de` varchar(200) NOT NULL,
  `icon_color` varchar(15) NOT NULL DEFAULT '#FF0000',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `terminated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`widget_template_id`),
  KEY `fk_Users_userid_idx` (`user_fk`),
  CONSTRAINT `FK_2f6c40f473d4373a7f6298b8ff4` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=839 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `widgets_templates_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `widgets_templates_models` (
  `widgets_models_id` int NOT NULL AUTO_INCREMENT,
  `widget_template_fk` int NOT NULL,
  `model_fk` int NOT NULL,
  PRIMARY KEY (`widgets_models_id`),
  UNIQUE KEY `widgetid_modelid_UNIQUE` (`widget_template_fk`,`model_fk`),
  KEY `fk_widgets_models_modelid_idx` (`model_fk`),
  CONSTRAINT `FK_2721ee80bd0c8933095904be6b5` FOREIGN KEY (`widget_template_fk`) REFERENCES `widgets_templates` (`widget_template_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_bbf9a7b3b82f8746f7d94f59221` FOREIGN KEY (`model_fk`) REFERENCES `models` (`model_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `widgets_templates_objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `widgets_templates_objects` (
  `widget_object_id` int NOT NULL AUTO_INCREMENT,
  `widget_template_fk` int NOT NULL,
  `mqtt_client_fk` varchar(200) GENERATED ALWAYS AS ((case when ((`mqtt_client_id_object` is not null) and (`mqtt_client_id_reservation` is not null)) then NULL when (`mqtt_client_id_object` is not null) then `mqtt_client_id_object` when (`mqtt_client_id_reservation` is not null) then `mqtt_client_id_reservation` else NULL end)) STORED NOT NULL,
  `mqtt_client_id_reservation` varchar(200) DEFAULT NULL,
  `mqtt_client_id_object` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`widget_object_id`),
  KEY `wop_widget_key` (`widget_template_fk`),
  KEY `FK_widobj_objs_mqtt` (`mqtt_client_id_object`),
  KEY `FK_widobj_reservs_mqtt_idx` (`mqtt_client_id_reservation`),
  CONSTRAINT `FK_645bdb6ceb5a4db3dd08417fd95` FOREIGN KEY (`widget_template_fk`) REFERENCES `widgets_templates` (`widget_template_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_widobj_objs_mqtt` FOREIGN KEY (`mqtt_client_id_object`) REFERENCES `objects` (`mqtt_client_id`),
  CONSTRAINT `FK_widobj_reservs_mqtt` FOREIGN KEY (`mqtt_client_id_reservation`) REFERENCES `objects_reservations` (`mqtt_client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
