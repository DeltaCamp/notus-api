import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1555105633816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "title" text NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "appId" integer, "parentId" integer, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "matchers_source_enum" AS ENUM('block.number', 'block.difficulty', 'block.timestamp', 'block.gasLimit', 'block.gasUsed', 'miner', 'transaction.creates', 'transaction.to', 'transaction.data', 'transaction.from', 'transaction.gasLimit', 'transaction.gasPrice', 'transaction.nonce', 'transaction.value', 'transaction.chainId', 'transaction.contractAddress', 'transaction.cumulativeGasUsed', 'transaction.gasUsed', 'log.address', 'log.topic[0]', 'log.topic[1]', 'log.topic[2]', 'log.topic[3]', 'log.data')`);
        await queryRunner.query(`CREATE TYPE "matchers_operator_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TYPE "matchers_operanddatatype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "matchers" ("id" SERIAL NOT NULL, "order" integer NOT NULL DEFAULT 1, "source" "matchers_source_enum" NOT NULL, "operator" "matchers_operator_enum" NOT NULL, "operand" text, "operandDataType" "matchers_operanddatatype_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer NOT NULL, CONSTRAINT "PK_84af8b70f57bbdcc106a21b31da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_matchers" ("id" SERIAL NOT NULL, "eventId" integer NOT NULL, "matcherId" integer NOT NULL, CONSTRAINT "PK_e16aba731f5dac8c01904418e3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apps" ("id" SERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "confirmed" boolean NOT NULL, "one_time_key_hash" text, "one_time_key_expires_at" TIMESTAMP WITH TIME ZONE, "password_hash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_603e041f034ae7bece6e7a14fab" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_b06421b4144772e37880b02ac3d" FOREIGN KEY ("parentId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD CONSTRAINT "FK_f6890910558f2c879eb1e1dd174" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_matchers" ADD CONSTRAINT "FK_dbd81804d1fe4fc3afd13783560" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_matchers" ADD CONSTRAINT "FK_d9d52f230bf1fa9a92cda761aff" FOREIGN KEY ("matcherId") REFERENCES "matchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apps" ADD CONSTRAINT "FK_fab1152a80b90058626ba4b5911" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "apps" DROP CONSTRAINT "FK_fab1152a80b90058626ba4b5911"`);
        await queryRunner.query(`ALTER TABLE "event_matchers" DROP CONSTRAINT "FK_d9d52f230bf1fa9a92cda761aff"`);
        await queryRunner.query(`ALTER TABLE "event_matchers" DROP CONSTRAINT "FK_dbd81804d1fe4fc3afd13783560"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP CONSTRAINT "FK_f6890910558f2c879eb1e1dd174"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_b06421b4144772e37880b02ac3d"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_603e041f034ae7bece6e7a14fab"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "apps"`);
        await queryRunner.query(`DROP TABLE "event_matchers"`);
        await queryRunner.query(`DROP TABLE "matchers"`);
        await queryRunner.query(`DROP TYPE "matchers_operanddatatype_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_operator_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_source_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
