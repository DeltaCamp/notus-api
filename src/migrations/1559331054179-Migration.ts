import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1559331054179 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "isActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "events" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

}
