import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1559150415720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "events" ADD "networkId" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "networkId" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`UPDATE "events" SET "networkId" = 1`)
        await queryRunner.query(`UPDATE "contracts" SET "networkId" = 1`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "networkId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "networkId"`);
    }

}
