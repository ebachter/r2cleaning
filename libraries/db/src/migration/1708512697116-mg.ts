import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1708512697116 implements MigrationInterface {
    name = 'Mg1708512697116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`objectType\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data2\` text NULL, \`user_id\` int NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`age\` int NULL, \`balance\` double NOT NULL DEFAULT '0', \`phoneNumber\` varchar(255) NOT NULL, \`data\` json NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phoneNumber\` varchar(255) NOT NULL, \`verificationID\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`DROP TABLE \`verification\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
