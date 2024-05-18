import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1710934103039 implements MigrationInterface {
    name = 'Mg1710934103039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` CHANGE \`objectType\` \`object_type\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`objects\` CHANGE \`object_type\` \`objectType\` enum ('house', 'appartment', 'entrance', 'office', 'fasade') NOT NULL`);
    }

}
