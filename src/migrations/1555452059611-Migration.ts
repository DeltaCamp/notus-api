import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1555452059611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "title" text NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP DEFAULT null, "userId" integer NOT NULL, "appId" integer, "parentId" integer, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "confirmed" boolean NOT NULL, "one_time_key_hash" text, "one_time_key_expires_at" TIMESTAMP WITH TIME ZONE, "password_hash" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apps" ("id" SERIAL NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "matchers_source_enum" AS ENUM('block.number', 'block.difficulty', 'block.timestamp', 'block.gasLimit', 'block.gasUsed', 'miner', 'transaction.creates', 'transaction.to', 'transaction.data', 'transaction.from', 'transaction.gasLimit', 'transaction.gasPrice', 'transaction.nonce', 'transaction.value', 'transaction.chainId', 'transaction.contractAddress', 'transaction.cumulativeGasUsed', 'transaction.gasUsed', 'log.address', 'log.topics[0]', 'log.topics[1]', 'log.topics[2]', 'log.topics[3]', 'log.data', 'contractEventInput')`);
        await queryRunner.query(`CREATE TYPE "matchers_operator_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TYPE "matchers_operanddatatype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`CREATE TABLE "matchers" ("id" SERIAL NOT NULL, "order" integer NOT NULL DEFAULT 1, "source" "matchers_source_enum" NOT NULL, "operator" "matchers_operator_enum" NOT NULL, "operand" text, "operandDataType" "matchers_operanddatatype_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer NOT NULL, "contractEventInputId" integer, CONSTRAINT "PK_84af8b70f57bbdcc106a21b31da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "name" text NOT NULL, "address" text, "abi" text NOT NULL, "isPublic" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_events" ("id" SERIAL NOT NULL, "name" text NOT NULL, "topic" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" integer, CONSTRAINT "PK_17d7f1e53e9a506a40fef579039" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "contract_event_inputs_type_enum" AS ENUM('uint', 'uint8', 'uint16', 'uint24', 'uint32', 'uint40', 'uint48', 'uint56', 'uint64', 'uint72', 'uint80', 'uint88', 'uint96', 'uint104', 'uint112', 'uint120', 'uint128', 'uint136', 'uint144', 'uint152', 'uint160', 'uint168', 'uint176', 'uint184', 'uint192', 'uint200', 'uint208', 'uint216', 'uint224', 'uint232', 'uint240', 'uint248', 'uint256', 'int', 'int8', 'int16', 'int24', 'int32', 'int40', 'int48', 'int56', 'int64', 'int72', 'int80', 'int88', 'int96', 'int104', 'int112', 'int120', 'int128', 'int136', 'int144', 'int152', 'int160', 'int168', 'int176', 'int184', 'int192', 'int200', 'int208', 'int216', 'int224', 'int232', 'int240', 'int248', 'int256', 'address', 'bool', 'string', 'byte', 'bytes', 'bytes1', 'bytes2', 'bytes3', 'bytes4', 'bytes5', 'bytes6', 'bytes7', 'bytes8', 'bytes9', 'bytes10', 'bytes11', 'bytes12', 'bytes13', 'bytes14', 'bytes15', 'bytes16', 'bytes17', 'bytes18', 'bytes19', 'bytes20', 'bytes21', 'bytes22', 'bytes23', 'bytes24', 'bytes25', 'bytes26', 'bytes27', 'bytes28', 'bytes29', 'bytes30', 'bytes31', 'bytes32')`);
        await queryRunner.query(`CREATE TABLE "contract_event_inputs" ("id" SERIAL NOT NULL, "name" text NOT NULL, "type" "contract_event_inputs_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractEventId" integer, CONSTRAINT "PK_d4c386da889fb165ce4abccabb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_603e041f034ae7bece6e7a14fab" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_b06421b4144772e37880b02ac3d" FOREIGN KEY ("parentId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apps" ADD CONSTRAINT "FK_fab1152a80b90058626ba4b5911" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD CONSTRAINT "FK_f6890910558f2c879eb1e1dd174" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD CONSTRAINT "FK_8de464ea0ba46ca6a557474de8e" FOREIGN KEY ("contractEventInputId") REFERENCES "contract_event_inputs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_83da1c4b4e98a1254703438aa9c" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_events" ADD CONSTRAINT "FK_bc412d7c35551e463b7408190e5" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_event_inputs" ADD CONSTRAINT "FK_527c291bf98243a112289a0939d" FOREIGN KEY ("contractEventId") REFERENCES "contract_events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "contract_event_inputs" DROP CONSTRAINT "FK_527c291bf98243a112289a0939d"`);
        await queryRunner.query(`ALTER TABLE "contract_events" DROP CONSTRAINT "FK_bc412d7c35551e463b7408190e5"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_83da1c4b4e98a1254703438aa9c"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP CONSTRAINT "FK_8de464ea0ba46ca6a557474de8e"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP CONSTRAINT "FK_f6890910558f2c879eb1e1dd174"`);
        await queryRunner.query(`ALTER TABLE "apps" DROP CONSTRAINT "FK_fab1152a80b90058626ba4b5911"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_b06421b4144772e37880b02ac3d"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_603e041f034ae7bece6e7a14fab"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`DROP TABLE "contract_event_inputs"`);
        await queryRunner.query(`DROP TYPE "contract_event_inputs_type_enum"`);
        await queryRunner.query(`DROP TABLE "contract_events"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TABLE "matchers"`);
        await queryRunner.query(`DROP TYPE "matchers_operanddatatype_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_operator_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_source_enum"`);
        await queryRunner.query(`DROP TABLE "apps"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
