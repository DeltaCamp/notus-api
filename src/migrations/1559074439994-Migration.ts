import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1559074439994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "confirmed"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "confirmedAt" TIMESTAMP`);

        // post table modification data upgrade:
        await queryRunner.query(`UPDATE "users" SET "confirmedAt" = now() WHERE password_hash IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`UPDATE "users" SET "confirmedAt" = NULL`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "confirmedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "confirmed" boolean NOT NULL`);
    }

}
