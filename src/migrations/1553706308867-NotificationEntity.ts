import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationEntity1553706308867 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "name" text NOT NULL, "address" character varying(64) NOT NULL, "topics" text array NOT NULL, "subject" text NOT NULL, "body" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "dapp_user_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_b2003d609b80f5280e73863fde1" FOREIGN KEY ("dapp_user_id") REFERENCES "dapp_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_b2003d609b80f5280e73863fde1"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
