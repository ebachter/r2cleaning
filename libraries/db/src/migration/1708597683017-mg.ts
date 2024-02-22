import { MigrationInterface, QueryRunner } from "typeorm";

export class Mg1708597683017 implements MigrationInterface {
    name = 'Mg1708597683017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1091a6d1e4c17d6b7aab3fefeb2\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_fk\` \`user_fk\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1091a6d1e4c17d6b7aab3fefeb2\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_1091a6d1e4c17d6b7aab3fefeb2\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`user_fk\` \`user_fk\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_1091a6d1e4c17d6b7aab3fefeb2\` FOREIGN KEY (\`user_fk\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
