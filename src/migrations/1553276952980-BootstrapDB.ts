import {MigrationInterface, QueryRunner} from "typeorm";

export class BootstrapDB1553276952980 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "confirmed" boolean NOT NULL, "confirmation_code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapps" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "api_key" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93d4d9b713eec4e21cf607efbfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapp_users" ("id" SERIAL NOT NULL, "owner" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "dapp_id" integer, CONSTRAINT "PK_28acab6f615f4f3cb5911c30850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_8ee01b202ad7c1834b2423b1266" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_c532e5efc03d30385781b49d390" FOREIGN KEY ("dapp_id") REFERENCES "dapps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_c532e5efc03d30385781b49d390"`);
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_8ee01b202ad7c1834b2423b1266"`);
        await queryRunner.query(`DROP TABLE "dapp_users"`);
        await queryRunner.query(`DROP TABLE "dapps"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
