import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710770219181 implements MigrationInterface {
    name = 'Mg1710770219181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`requests\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`objectType\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL, \`data2\` text NULL, \`user_fk\` int NOT NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`requests\` ADD CONSTRAINT \`FK_9128a89d08927d464663a09c230\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requests\` DROP FOREIGN KEY \`FK_9128a89d08927d464663a09c230\``);
        await queryRunner.query(`DROP TABLE \`requests\``);
    }

}
