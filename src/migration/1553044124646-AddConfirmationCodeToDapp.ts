import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConfirmationCodeToDapp1553044124646 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp" ADD "confirmationCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp" DROP COLUMN "confirmationCode"`);
    }

}
