import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApiKeyAndConfirmedToDapps1553027683856 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp" ADD "apiKey" character varying`);
        await queryRunner.query(`ALTER TABLE "dapp" ADD "confirmed" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp" DROP COLUMN "confirmed"`);
        await queryRunner.query(`ALTER TABLE "dapp" DROP COLUMN "apiKey"`);
    }

}
