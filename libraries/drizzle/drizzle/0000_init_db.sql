CREATE TABLE `object` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`addressCity` enum('grosny','argun','gudermes') NOT NULL,
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
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20),
	`email` varchar(40),
	`verificationId` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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