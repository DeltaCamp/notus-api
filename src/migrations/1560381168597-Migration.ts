import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1560381168597 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "abis" ALTER COLUMN "isPublic" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "abis" ALTER COLUMN "isPublic" DROP DEFAULT`);
    }

}
