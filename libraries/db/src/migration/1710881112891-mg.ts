import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710881112891 implements MigrationInterface {
    name = 'Mg1710881112891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`price\` decimal(5,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`price\``);
    }

}
