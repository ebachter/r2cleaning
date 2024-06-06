import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1717602584149 implements MigrationInterface {
    name = 'Mg1717602584149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`objects\` (\`object_id\` int NOT NULL AUTO_INCREMENT, \`object_type\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data\` text NULL, \`area\` decimal(5,2) NULL, \`user_fk\` int NOT NULL, PRIMARY KEY (\`object_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`object_type\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data2\` text NULL, \`price\` decimal(5,2) NULL, \`user_fk\` int NOT NULL, \`object_fk\` int NOT NULL, \`contractor_fk\` int NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`age\` int NULL, \`balance\` double NOT NULL DEFAULT '0', \`phoneNumber\` varchar(255) NOT NULL, \`data\` json NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phoneNumber\` varchar(255) NOT NULL, \`verificationID\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`objects\` ADD CONSTRAINT \`FK_8c0578c0741d0d0ff5312ef3e00\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1091a6d1e4c17d6b7aab3fefeb2\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_282327d9c5e7a900d4e3eae6739\` FOREIGN KEY (\`object_fk\`) REFERENCES \`objects\`(\`object_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_be823dee080d28ab014982dca54\` FOREIGN KEY (\`contractor_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_be823dee080d28ab014982dca54\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_282327d9c5e7a900d4e3eae6739\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1091a6d1e4c17d6b7aab3fefeb2\``);
        await queryRunner.query(`ALTER TABLE \`objects\` DROP FOREIGN KEY \`FK_8c0578c0741d0d0ff5312ef3e00\``);
        await queryRunner.query(`DROP TABLE \`verification\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`objects\``);
    }

}
