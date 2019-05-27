import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1558994814517 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "events" ADD "callWebhook" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "runCount" SET DEFAULT -1`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "deletedAt" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "contracts" ALTER COLUMN "deletedAt" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contracts" ALTER COLUMN "deletedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "deletedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "runCount" SET DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "callWebhook"`);
    }

}
