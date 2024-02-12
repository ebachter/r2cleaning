import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1707600064654 implements MigrationInterface {
    name = 'Mg1707600064654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`age\` int NULL, \`balance\` double NOT NULL DEFAULT '0', \`phoneNumber\` varchar(255) NOT NULL, \`data\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phoneNumber\` varchar(255) NOT NULL, \`verificationID\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`objectType\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`verification\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
