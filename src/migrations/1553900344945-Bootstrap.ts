import {MigrationInterface, QueryRunner} from "typeorm";

export class Bootstrap1553900344945 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "confirmed" boolean NOT NULL, "access_key_hash" character varying, "access_key_expires_at" TIMESTAMP WITH TIME ZONE, "access_request_key_hash" character varying, "request_key_expires_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapps" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "api_key" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93d4d9b713eec4e21cf607efbfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "name" text NOT NULL, "address" character varying(64) NOT NULL, "topics" text array NOT NULL, "subject" text NOT NULL, "body" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "dapp_user_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapp_users" ("id" SERIAL NOT NULL, "owner" boolean NOT NULL, "access_key" character varying, "access_key_expires_at" TIMESTAMP WITH TIME ZONE, "request_key" character varying, "request_key_expires_at" TIMESTAMP WITH TIME ZONE, "confirmed" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "dapp_id" integer, CONSTRAINT "PK_28acab6f615f4f3cb5911c30850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_b2003d609b80f5280e73863fde1" FOREIGN KEY ("dapp_user_id") REFERENCES "dapp_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_8ee01b202ad7c1834b2423b1266" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_c532e5efc03d30385781b49d390" FOREIGN KEY ("dapp_id") REFERENCES "dapps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_c532e5efc03d30385781b49d390"`);
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_8ee01b202ad7c1834b2423b1266"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_b2003d609b80f5280e73863fde1"`);
        await queryRunner.query(`DROP TABLE "dapp_users"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "dapps"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
