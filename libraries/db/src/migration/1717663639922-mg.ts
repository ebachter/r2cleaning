import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1717663639922 implements MigrationInterface {
    name = 'Mg1717663639922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` ADD \`address\` varchar(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` DROP COLUMN \`address\``);
    }

}
