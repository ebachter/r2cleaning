import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1707608806357 implements MigrationInterface {
    name = 'Mg1707608806357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`data\` \`data2\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`data2\` \`data\` text NULL`);
    }

}
