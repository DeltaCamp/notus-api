import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1558119023285 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "events_scope_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "scope" "events_scope_enum" NOT NULL DEFAULT '0', "title" text NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "runCount" integer NOT NULL DEFAULT -1, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP DEFAULT null, "webhookUrl" text, "webhookBody" text, "color" text NOT NULL DEFAULT '#2a083f', "sendEmail" boolean NOT NULL DEFAULT true, "disableEmailKey" text NOT NULL, "userId" integer NOT NULL, "abiEventId" integer, "appId" integer, "contractId" integer, "parentId" integer, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "confirmed" boolean NOT NULL, "one_time_key_hash" text, "one_time_key_expires_at" TIMESTAMP WITH TIME ZONE, "password_hash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apps" ("id" SERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "matchers_source_enum" AS ENUM('transaction.value', 'transaction.to', 'transaction.from', 'transaction.data', 'transaction.gasLimit', 'transaction.gasPrice', 'transaction.creates', 'transaction.gasUsed', 'block.timestamp', 'block.number', 'miner', 'block.difficulty', 'block.gasLimit', 'block.gasUsed', 'log.address', 'log.topics[0]', 'log.topics[1]', 'log.topics[2]', 'log.topics[3]', 'log.data', 'abiEventInput')`);
        await queryRunner.query(`CREATE TYPE "matchers_operator_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "matchers" ("id" SERIAL NOT NULL, "order" integer NOT NULL DEFAULT 1, "source" "matchers_source_enum" NOT NULL, "operator" "matchers_operator_enum" NOT NULL, "operand" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer NOT NULL, "abiEventInputId" integer, CONSTRAINT "PK_84af8b70f57bbdcc106a21b31da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "abis" ("id" SERIAL NOT NULL, "name" text NOT NULL, "abi" text NOT NULL, "isPublic" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_4d5c47bb40faf1b5c03ce145d0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "abi_events" ("id" SERIAL NOT NULL, "name" text NOT NULL, "topic" text NOT NULL, "isPublic" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "abiId" integer, CONSTRAINT "PK_050a4d4e20960736516215be6bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "abi_event_inputs_type_enum" AS ENUM('uint', 'uint8', 'uint16', 'uint24', 'uint32', 'uint40', 'uint48', 'uint56', 'uint64', 'uint72', 'uint80', 'uint88', 'uint96', 'uint104', 'uint112', 'uint120', 'uint128', 'uint136', 'uint144', 'uint152', 'uint160', 'uint168', 'uint176', 'uint184', 'uint192', 'uint200', 'uint208', 'uint216', 'uint224', 'uint232', 'uint240', 'uint248', 'uint256', 'int', 'int8', 'int16', 'int24', 'int32', 'int40', 'int48', 'int56', 'int64', 'int72', 'int80', 'int88', 'int96', 'int104', 'int112', 'int120', 'int128', 'int136', 'int144', 'int152', 'int160', 'int168', 'int176', 'int184', 'int192', 'int200', 'int208', 'int216', 'int224', 'int232', 'int240', 'int248', 'int256', 'address', 'bool', 'string', 'byte', 'bytes', 'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes5', 'bytes6', 'bytes7', 'bytes8', 'bytes9', 'bytes10', 'bytes11', 'bytes12', 'bytes13', 'bytes14', 'bytes15', 'bytes16', 'bytes17', 'bytes18', 'bytes19', 'bytes20', 'bytes21', 'bytes22', 'bytes23', 'bytes24', 'bytes25', 'bytes26', 'bytes27', 'bytes28', 'bytes29', 'bytes30', 'bytes31', 'bytes32')`);
        await queryRunner.query(`CREATE TYPE "abi_event_inputs_metatype_enum" AS ENUM('wei', 'timestamp', 'fixedPoint1', 'fixedPoint2', 'fixedPoint3', 'fixedPoint4', 'fixedPoint5', 'fixedPoint6', 'fixedPoint7', 'fixedPoint8', 'fixedPoint9', 'fixedPoint10', 'fixedPoint11', 'fixedPoint12', 'fixedPoint13', 'fixedPoint14', 'fixedPoint15', 'fixedPoint16', 'fixedPoint17', 'fixedPoint18', 'fixedPoint19', 'fixedPoint20', 'fixedPoint21', 'fixedPoint22', 'fixedPoint23', 'fixedPoint24', 'fixedPoint25', 'fixedPoint26', 'fixedPoint27', 'fixedPoint28', 'fixedPoint29', 'fixedPoint30', 'fixedPoint31')`);
        await queryRunner.query(`CREATE TABLE "abi_event_inputs" ("id" SERIAL NOT NULL, "name" text NOT NULL, "type" "abi_event_inputs_type_enum" NOT NULL, "metaType" "abi_event_inputs_metatype_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "abiEventId" integer, CONSTRAINT "PK_5cd4dc5ab935687cfb9dae2b039" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_logs" ("id" SERIAL NOT NULL, "chainId" integer NOT NULL, "lastCompletedBlockNumber" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4f3234af57451baa20576887be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "name" text NOT NULL, "address" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP DEFAULT null, "ownerId" integer, "abiId" integer, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_logs" ("id" SERIAL NOT NULL, "windowStartAt" TIMESTAMP WITH TIME ZONE NOT NULL, "windowCount" integer NOT NULL, "warningSent" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer, CONSTRAINT "PK_b09cf1bb58150797d898076b242" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "webhook_headers" ("id" SERIAL NOT NULL, "key" text NOT NULL, "value" text NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_2862bfdbde358514aa6aca433fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_50180127b5727e1b8d434230064" FOREIGN KEY ("abiEventId") REFERENCES "abi_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_603e041f034ae7bece6e7a14fab" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_97a0144f68f706ece9a06541d86" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_b06421b4144772e37880b02ac3d" FOREIGN KEY ("parentId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apps" ADD CONSTRAINT "FK_fab1152a80b90058626ba4b5911" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD CONSTRAINT "FK_f6890910558f2c879eb1e1dd174" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD CONSTRAINT "FK_e4edf4dc962036e5801a22014a5" FOREIGN KEY ("abiEventInputId") REFERENCES "abi_event_inputs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abis" ADD CONSTRAINT "FK_254f72650f1df95d2104d9e3b97" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abi_events" ADD CONSTRAINT "FK_b53f1ad5c3423bc9190bcd54d40" FOREIGN KEY ("abiId") REFERENCES "abis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abi_event_inputs" ADD CONSTRAINT "FK_68fd6317edadc7b05c99d99b0b6" FOREIGN KEY ("abiEventId") REFERENCES "abi_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_83da1c4b4e98a1254703438aa9c" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_a343b55b5f5ebbbb35779353ec8" FOREIGN KEY ("abiId") REFERENCES "abis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_logs" ADD CONSTRAINT "FK_dfde4711e1ec00e6cef05ade815" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "webhook_headers" ADD CONSTRAINT "FK_23cb0efcde22c5d62195f74727b" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "webhook_headers" DROP CONSTRAINT "FK_23cb0efcde22c5d62195f74727b"`);
        await queryRunner.query(`ALTER TABLE "event_logs" DROP CONSTRAINT "FK_dfde4711e1ec00e6cef05ade815"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_a343b55b5f5ebbbb35779353ec8"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_83da1c4b4e98a1254703438aa9c"`);
        await queryRunner.query(`ALTER TABLE "abi_event_inputs" DROP CONSTRAINT "FK_68fd6317edadc7b05c99d99b0b6"`);
        await queryRunner.query(`ALTER TABLE "abi_events" DROP CONSTRAINT "FK_b53f1ad5c3423bc9190bcd54d40"`);
        await queryRunner.query(`ALTER TABLE "abis" DROP CONSTRAINT "FK_254f72650f1df95d2104d9e3b97"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP CONSTRAINT "FK_e4edf4dc962036e5801a22014a5"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP CONSTRAINT "FK_f6890910558f2c879eb1e1dd174"`);
        await queryRunner.query(`ALTER TABLE "apps" DROP CONSTRAINT "FK_fab1152a80b90058626ba4b5911"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_b06421b4144772e37880b02ac3d"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_97a0144f68f706ece9a06541d86"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_603e041f034ae7bece6e7a14fab"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_50180127b5727e1b8d434230064"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`DROP TABLE "webhook_headers"`);
        await queryRunner.query(`DROP TABLE "event_logs"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TABLE "work_logs"`);
        await queryRunner.query(`DROP TABLE "abi_event_inputs"`);
        await queryRunner.query(`DROP TYPE "abi_event_inputs_metatype_enum"`);
        await queryRunner.query(`DROP TYPE "abi_event_inputs_type_enum"`);
        await queryRunner.query(`DROP TABLE "abi_events"`);
        await queryRunner.query(`DROP TABLE "abis"`);
        await queryRunner.query(`DROP TABLE "matchers"`);
        await queryRunner.query(`DROP TYPE "matchers_operator_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_source_enum"`);
        await queryRunner.query(`DROP TABLE "apps"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "events_scope_enum"`);
    }

}
