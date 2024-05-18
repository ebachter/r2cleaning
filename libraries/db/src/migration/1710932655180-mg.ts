import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710932655180 implements MigrationInterface {
    name = 'Mg1710932655180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`objects\` (\`object_id\` int NOT NULL AUTO_INCREMENT, \`objectType\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data\` text NULL, \`price\` decimal(5,2) NULL, \`user_fk\` int NOT NULL, PRIMARY KEY (\`object_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`objects\` ADD CONSTRAINT \`FK_8c0578c0741d0d0ff5312ef3e00\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` DROP FOREIGN KEY \`FK_8c0578c0741d0d0ff5312ef3e00\``);
        await queryRunner.query(`DROP TABLE \`objects\``);
    }

}
