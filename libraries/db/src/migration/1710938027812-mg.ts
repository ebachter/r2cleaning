import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710938027812 implements MigrationInterface {
    name = 'Mg1710938027812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` DROP COLUMN \`price\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` ADD \`price\` decimal(5,2) NULL`);
    }

}
