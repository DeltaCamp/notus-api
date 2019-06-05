import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1559766691389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "abi_events" ADD "title" text`);
        await queryRunner.query(`UPDATE "abi_events" SET "title" = "name"`)
        await queryRunner.query(`ALTER TABLE "abi_events" ALTER COLUMN "title" SET NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "abi_events" DROP COLUMN "title"`);
    }

}
