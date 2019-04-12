import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1555092276029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "matchers_source_enum" AS ENUM('block.number', 'block.difficulty', 'block.timestamp', 'block.gasLimit', 'block.gasUsed', 'miner', 'transaction.creates', 'transaction.to', 'transaction.data', 'transaction.from', 'transaction.gasLimit', 'transaction.gasPrice', 'transaction.nonce', 'transaction.value', 'transaction.chainId', 'transaction.contractAddress', 'transaction.cumulativeGasUsed', 'transaction.gasUsed', 'log.address', 'log.topic[0]', 'log.topic[1]', 'log.topic[2]', 'log.topic[3]', 'log.data')`);
        await queryRunner.query(`CREATE TYPE "matchers_operator_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TYPE "matchers_operanddatatype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "matchers" ("id" SERIAL NOT NULL, "source" "matchers_source_enum" NOT NULL, "operator" "matchers_operator_enum" NOT NULL, "operand" text NOT NULL, "operandDataType" "matchers_operanddatatype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_84af8b70f57bbdcc106a21b31da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipes" ("id" SERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dappId" integer NOT NULL, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_matchers" ("id" SERIAL NOT NULL, "recipeId" integer NOT NULL, "matcherId" integer NOT NULL, CONSTRAINT "PK_66f34f4600760c7f3549fab4ee3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_matchers" ("id" SERIAL NOT NULL, "eventId" integer NOT NULL, "matcherId" integer NOT NULL, CONSTRAINT "PK_e16aba731f5dac8c01904418e3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapps" ("id" SERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93d4d9b713eec4e21cf607efbfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "confirmed" boolean NOT NULL, "one_time_key_hash" character varying, "one_time_key_expires_at" TIMESTAMP WITH TIME ZONE, "password_hash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapp_users" ("id" SERIAL NOT NULL, "owner" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "dappId" integer NOT NULL, CONSTRAINT "PK_28acab6f615f4f3cb5911c30850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "recipeId" integer NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_6189ac52ebbd2a386da622d5ef4" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_matchers" ADD CONSTRAINT "FK_bc05d198bd9eba73923c5740fe5" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_matchers" ADD CONSTRAINT "FK_3c7b0a6995cf16779875954880a" FOREIGN KEY ("matcherId") REFERENCES "matchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_matchers" ADD CONSTRAINT "FK_dbd81804d1fe4fc3afd13783560" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_matchers" ADD CONSTRAINT "FK_d9d52f230bf1fa9a92cda761aff" FOREIGN KEY ("matcherId") REFERENCES "matchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_dd9c69579f70d9b6373cd19d139" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_b1040fe6693329dfd7e8bd83f72" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_c0873881544cca0dd7bf7656179" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_c0873881544cca0dd7bf7656179"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_b1040fe6693329dfd7e8bd83f72"`);
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_dd9c69579f70d9b6373cd19d139"`);
        await queryRunner.query(`ALTER TABLE "event_matchers" DROP CONSTRAINT "FK_d9d52f230bf1fa9a92cda761aff"`);
        await queryRunner.query(`ALTER TABLE "event_matchers" DROP CONSTRAINT "FK_dbd81804d1fe4fc3afd13783560"`);
        await queryRunner.query(`ALTER TABLE "recipe_matchers" DROP CONSTRAINT "FK_3c7b0a6995cf16779875954880a"`);
        await queryRunner.query(`ALTER TABLE "recipe_matchers" DROP CONSTRAINT "FK_bc05d198bd9eba73923c5740fe5"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_6189ac52ebbd2a386da622d5ef4"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "dapp_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "dapps"`);
        await queryRunner.query(`DROP TABLE "event_matchers"`);
        await queryRunner.query(`DROP TABLE "recipe_matchers"`);
        await queryRunner.query(`DROP TABLE "recipes"`);
        await queryRunner.query(`DROP TABLE "matchers"`);
        await queryRunner.query(`DROP TYPE "matchers_operanddatatype_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_operator_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_source_enum"`);
    }

}
