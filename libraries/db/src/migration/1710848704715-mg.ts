import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710848704715 implements MigrationInterface {
    name = 'Mg1710848704715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`objectType\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data2\` text NULL, \`user_fk\` int NOT NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1091a6d1e4c17d6b7aab3fefeb2\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1091a6d1e4c17d6b7aab3fefeb2\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
