import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710879591604 implements MigrationInterface {
    name = 'Mg1710879591604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`contractor_fk\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_be823dee080d28ab014982dca54\` FOREIGN KEY (\`contractor_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_be823dee080d28ab014982dca54\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`contractor_fk\``);
    }

}
