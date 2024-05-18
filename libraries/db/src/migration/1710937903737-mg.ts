import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710937903737 implements MigrationInterface {
    name = 'Mg1710937903737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` ADD \`surface\` decimal(5,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` DROP COLUMN \`surface\``);
    }

}
