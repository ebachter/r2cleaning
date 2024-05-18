import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710942217975 implements MigrationInterface {
    name = 'Mg1710942217975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` CHANGE \`surface\` \`area\` decimal(5,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` CHANGE \`area\` \`surface\` decimal(5,2) NULL`);
    }

}
