CREATE TABLE `city` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`country` int unsigned NOT NULL DEFAULT 1,
	`nameEn` varchar(100) NOT NULL,
	`nameDe` varchar(100) NOT NULL,
	`nameRu` varchar(100) NOT NULL,
	`userId` int unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `city_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_city_en` UNIQUE(`country`,`nameEn`),
	CONSTRAINT `uq_city_de` UNIQUE(`country`,`nameDe`),
	CONSTRAINT `uq_city_ru` UNIQUE(`country`,`nameRu`)
);
--> statement-breakpoint
CREATE TABLE `country` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`nameDe` varchar(100) NOT NULL,
	`nameRu` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `country_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_country_nameEn` UNIQUE(`nameEn`),
	CONSTRAINT `uq_country_nameDe` UNIQUE(`nameDe`),
	CONSTRAINT `uq_country_nameRu` UNIQUE(`nameRu`)
);
--> statement-breakpoint
CREATE TABLE `object` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`city` int unsigned NOT NULL,
	`addressStreet` varchar(255) NOT NULL,
	`objectType` int unsigned NOT NULL,
	`area` decimal(10,4) NOT NULL,
	`userId` int unsigned NOT NULL,
	`details` json NOT NULL,
	CONSTRAINT `object_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `objectType` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` json NOT NULL,
	CONSTRAINT `objectType_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offer` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`requestId` int unsigned NOT NULL,
	`userId` int unsigned NOT NULL,
	`cleaningTime` time NOT NULL,
	`price` decimal(10,4) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offer_id` PRIMARY KEY(`id`),
	CONSTRAINT `offer_uq_requestId_userId` UNIQUE(`requestId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`objectId` int unsigned NOT NULL,
	`requestId` int unsigned NOT NULL,
	`offerId` int unsigned NOT NULL,
	`cleaningDate` date NOT NULL,
	`cleaningTime` time NOT NULL,
	`price` decimal(10,4) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_requestId_offerId` UNIQUE(`requestId`,`offerId`)
);
--> statement-breakpoint
CREATE TABLE `requestService` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`requestId` int unsigned NOT NULL,
	`serviceTypeId` int unsigned NOT NULL,
	`userId` int unsigned NOT NULL,
	CONSTRAINT `requestService_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `request` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`objectId` int unsigned NOT NULL,
	`userId` int unsigned NOT NULL,
	`cleaningDate` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceOffer` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`userId` int unsigned NOT NULL,
	`serviceTypeId` int unsigned NOT NULL,
	CONSTRAINT `serviceOffer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceType` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` json NOT NULL,
	CONSTRAINT `serviceType_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`firstName` varchar(50) NOT NULL DEFAULT '',
	`lastName` varchar(50) NOT NULL DEFAULT '',
	`age` int unsigned,
	`balance` decimal(10,4) DEFAULT '0',
	`phoneNumber` varchar(20),
	`email` varchar(40),
	`passwordHash` varchar(100) NOT NULL,
	`isAdmin` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`firstName` varchar(40) NOT NULL,
	`lastName` varchar(40) NOT NULL,
	`passwordHash` varchar(100) NOT NULL,
	`phoneNumber` varchar(20),
	`email` varchar(40),
	`verificationCode` varchar(20),
	`ip` varchar(20),
	`counter` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_email` UNIQUE(`email`),
	CONSTRAINT `uq_ip` UNIQUE(`ip`)
);
--> statement-breakpoint
ALTER TABLE `city` ADD CONSTRAINT `city_country_country_id_fk` FOREIGN KEY (`country`) REFERENCES `country`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `city` ADD CONSTRAINT `city_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `object` ADD CONSTRAINT `object_city_city_id_fk` FOREIGN KEY (`city`) REFERENCES `city`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `object` ADD CONSTRAINT `object_objectType_objectType_id_fk` FOREIGN KEY (`objectType`) REFERENCES `objectType`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `object` ADD CONSTRAINT `object_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `offer` ADD CONSTRAINT `offer_requestId_request_id_fk` FOREIGN KEY (`requestId`) REFERENCES `request`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `offer` ADD CONSTRAINT `offer_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `order` ADD CONSTRAINT `order_objectId_object_id_fk` FOREIGN KEY (`objectId`) REFERENCES `object`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `order` ADD CONSTRAINT `order_requestId_request_id_fk` FOREIGN KEY (`requestId`) REFERENCES `request`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `order` ADD CONSTRAINT `order_offerId_request_id_fk` FOREIGN KEY (`offerId`) REFERENCES `request`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `requestService` ADD CONSTRAINT `requestService_requestId_request_id_fk` FOREIGN KEY (`requestId`) REFERENCES `request`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `requestService` ADD CONSTRAINT `requestService_serviceTypeId_serviceType_id_fk` FOREIGN KEY (`serviceTypeId`) REFERENCES `serviceType`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `requestService` ADD CONSTRAINT `requestService_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `request` ADD CONSTRAINT `request_objectId_object_id_fk` FOREIGN KEY (`objectId`) REFERENCES `object`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `request` ADD CONSTRAINT `request_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `serviceOffer` ADD CONSTRAINT `serviceOffer_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `serviceOffer` ADD CONSTRAINT `serviceOffer_serviceTypeId_serviceType_id_fk` FOREIGN KEY (`serviceTypeId`) REFERENCES `serviceType`(`id`) ON DELETE restrict ON UPDATE cascade;