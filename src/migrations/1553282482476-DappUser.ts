import {MigrationInterface, QueryRunner} from "typeorm";

export class DappUser1553282482476 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "dapp" ("id" SERIAL NOT NULL, "dappName" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "views" integer NOT NULL, "apiKey" character varying NOT NULL, "confirmed" boolean NOT NULL, "confirmationCode" character varying NOT NULL, CONSTRAINT "PK_0ae9da012097f3d50d780776fda" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "dapp"`);
    }

}
