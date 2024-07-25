import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1721668916663 implements MigrationInterface {
    name = 'Mg1721668916663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`objects\` (\`object_id\` int NOT NULL AUTO_INCREMENT, \`address_city\` enum ('grosny', 'argun', 'gudermes') NOT NULL, \`address_street\` varchar(500) NOT NULL, \`object_type\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`area\` decimal(5,2) NULL, \`object_details\` json NOT NULL, \`user_fk\` int NOT NULL, PRIMARY KEY (\`object_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`price\` decimal(5,2) NULL, \`user_fk\` int NOT NULL, \`object_fk\` int NOT NULL, \`contractor_fk\` int NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`age\` int NULL, \`balance\` double NOT NULL DEFAULT '0', \`phoneNumber\` varchar(255) NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phoneNumber\` varchar(255) NOT NULL, \`verificationID\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service_types\` (\`service_type_id\` int NOT NULL AUTO_INCREMENT, \`serviceName\` json NOT NULL, PRIMARY KEY (\`service_type_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service_offers\` (\`service_offer_id\` int NOT NULL AUTO_INCREMENT, \`price\` decimal(5,2) NULL, \`serviceTypeServiceTypeId\` int NULL, \`userUserId\` int NOT NULL, PRIMARY KEY (\`service_offer_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_services\` (\`order_service_id\` int NOT NULL AUTO_INCREMENT, \`order_fk\` int NOT NULL, \`service_type_fk\` int NULL, \`user_fk\` int NOT NULL, PRIMARY KEY (\`order_service_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`objects\` ADD CONSTRAINT \`FK_8c0578c0741d0d0ff5312ef3e00\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1091a6d1e4c17d6b7aab3fefeb2\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_282327d9c5e7a900d4e3eae6739\` FOREIGN KEY (\`object_fk\`) REFERENCES \`objects\`(\`object_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_be823dee080d28ab014982dca54\` FOREIGN KEY (\`contractor_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_offers\` ADD CONSTRAINT \`FK_be8e5cc243434b4666176daae6c\` FOREIGN KEY (\`serviceTypeServiceTypeId\`) REFERENCES \`service_types\`(\`service_type_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service_offers\` ADD CONSTRAINT \`FK_12cf39371152c063f77c91100f9\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_services\` ADD CONSTRAINT \`FK_a6a2e6962f0992c2f2110ea672f\` FOREIGN KEY (\`order_fk\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_services\` ADD CONSTRAINT \`FK_a0a5d927bc3c6b9e4e42bc13936\` FOREIGN KEY (\`service_type_fk\`) REFERENCES \`service_types\`(\`service_type_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_services\` ADD CONSTRAINT \`FK_713fe5720ae538254dd373bb9c1\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_services\` DROP FOREIGN KEY \`FK_713fe5720ae538254dd373bb9c1\``);
        await queryRunner.query(`ALTER TABLE \`order_services\` DROP FOREIGN KEY \`FK_a0a5d927bc3c6b9e4e42bc13936\``);
        await queryRunner.query(`ALTER TABLE \`order_services\` DROP FOREIGN KEY \`FK_a6a2e6962f0992c2f2110ea672f\``);
        await queryRunner.query(`ALTER TABLE \`service_offers\` DROP FOREIGN KEY \`FK_12cf39371152c063f77c91100f9\``);
        await queryRunner.query(`ALTER TABLE \`service_offers\` DROP FOREIGN KEY \`FK_be8e5cc243434b4666176daae6c\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_be823dee080d28ab014982dca54\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_282327d9c5e7a900d4e3eae6739\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1091a6d1e4c17d6b7aab3fefeb2\``);
        await queryRunner.query(`ALTER TABLE \`objects\` DROP FOREIGN KEY \`FK_8c0578c0741d0d0ff5312ef3e00\``);
        await queryRunner.query(`DROP TABLE \`order_services\``);
        await queryRunner.query(`DROP TABLE \`service_offers\``);
        await queryRunner.query(`DROP TABLE \`service_types\``);
        await queryRunner.query(`DROP TABLE \`verification\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`objects\``);
    }

}
