import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1558998080077 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "etherscan_api_key" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "etherscan_api_key"`);
    }

}
