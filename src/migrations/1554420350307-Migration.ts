import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1554420350307 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "variables_source_enum" AS ENUM('block.number', 'block.difficulty', 'block.timestamp', 'block.gasLimit', 'block.gasUsed', 'miner', 'transaction.creates', 'transaction.to', 'transaction.data', 'transaction.from', 'transaction.gasLimit', 'transaction.gasPrice', 'transaction.nonce', 'transaction.value', 'transaction.chainId', 'transaction.contractAddress', 'transaction.cumulativeGasUsed', 'transaction.gasUsed', 'log.address', 'log.topic[0]', 'log.topic[1]', 'log.topic[2]', 'log.topic[3]', 'log.data')`);
        await queryRunner.query(`CREATE TABLE "variables" ("id" SERIAL NOT NULL, "source" "variables_source_enum" NOT NULL, "sourceDataType" text NOT NULL, "description" text NOT NULL, "isPublic" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventTypeId" integer NOT NULL, CONSTRAINT "PK_395ef5737c2bfc06e701bd2f7e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "matchers_type_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "matchers" ("id" SERIAL NOT NULL, "type" "matchers_type_enum" NOT NULL, "operand" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "variableId" integer NOT NULL, CONSTRAINT "PK_84af8b70f57bbdcc106a21b31da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_type_matchers" ("id" SERIAL NOT NULL, "eventTypeId" integer, "matcherId" integer, CONSTRAINT "PK_b57897c5c4df930b5e62c104ed0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapps" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93d4d9b713eec4e21cf607efbfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_types" ("id" SERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dappId" integer NOT NULL, CONSTRAINT "PK_ffe6b2d60596409fb08fb13830d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_matchers" ("id" SERIAL NOT NULL, "eventId" integer NOT NULL, "matcherId" integer NOT NULL, CONSTRAINT "PK_e16aba731f5dac8c01904418e3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "eventTypeId" integer NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "email" character varying(320) NOT NULL, "confirmed" boolean NOT NULL, "one_time_key_hash" character varying, "one_time_key_expires_at" TIMESTAMP WITH TIME ZONE, "password_hash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dapp_users" ("id" SERIAL NOT NULL, "owner" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "dappId" integer NOT NULL, CONSTRAINT "PK_28acab6f615f4f3cb5911c30850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "variables" ADD CONSTRAINT "FK_25e962a6300fd1bb42c24889b47" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD CONSTRAINT "FK_6a2a33379dcb29277a25db6a4ab" FOREIGN KEY ("variableId") REFERENCES "variables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type_matchers" ADD CONSTRAINT "FK_8f16a0591430c3b80df1c6c6c78" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_type_matchers" ADD CONSTRAINT "FK_d9a2e0eff2bc418ea1cc4548996" FOREIGN KEY ("matcherId") REFERENCES "matchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_types" ADD CONSTRAINT "FK_af348446f99e2564b4bcd2737eb" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_matchers" ADD CONSTRAINT "FK_dbd81804d1fe4fc3afd13783560" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_matchers" ADD CONSTRAINT "FK_d9d52f230bf1fa9a92cda761aff" FOREIGN KEY ("matcherId") REFERENCES "matchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_7199bcdd91fbb3f07dafa54c1d8" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_dd9c69579f70d9b6373cd19d139" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dapp_users" ADD CONSTRAINT "FK_b1040fe6693329dfd7e8bd83f72" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_b1040fe6693329dfd7e8bd83f72"`);
        await queryRunner.query(`ALTER TABLE "dapp_users" DROP CONSTRAINT "FK_dd9c69579f70d9b6373cd19d139"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_7199bcdd91fbb3f07dafa54c1d8"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`ALTER TABLE "event_matchers" DROP CONSTRAINT "FK_d9d52f230bf1fa9a92cda761aff"`);
        await queryRunner.query(`ALTER TABLE "event_matchers" DROP CONSTRAINT "FK_dbd81804d1fe4fc3afd13783560"`);
        await queryRunner.query(`ALTER TABLE "event_types" DROP CONSTRAINT "FK_af348446f99e2564b4bcd2737eb"`);
        await queryRunner.query(`ALTER TABLE "event_type_matchers" DROP CONSTRAINT "FK_d9a2e0eff2bc418ea1cc4548996"`);
        await queryRunner.query(`ALTER TABLE "event_type_matchers" DROP CONSTRAINT "FK_8f16a0591430c3b80df1c6c6c78"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP CONSTRAINT "FK_6a2a33379dcb29277a25db6a4ab"`);
        await queryRunner.query(`ALTER TABLE "variables" DROP CONSTRAINT "FK_25e962a6300fd1bb42c24889b47"`);
        await queryRunner.query(`DROP TABLE "dapp_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "event_matchers"`);
        await queryRunner.query(`DROP TABLE "event_types"`);
        await queryRunner.query(`DROP TABLE "dapps"`);
        await queryRunner.query(`DROP TABLE "event_type_matchers"`);
        await queryRunner.query(`DROP TABLE "matchers"`);
        await queryRunner.query(`DROP TYPE "matchers_type_enum"`);
        await queryRunner.query(`DROP TABLE "variables"`);
        await queryRunner.query(`DROP TYPE "variables_source_enum"`);
    }

}
