import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1555021386599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "matchers" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "matchers_type_enum"`);
        await queryRunner.query(`CREATE TYPE "matchers_operator_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD "operator" "matchers_operator_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "matchers_operanddatatype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD "operandDataType" "matchers_operanddatatype_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "matchers" DROP COLUMN "operandDataType"`);
        await queryRunner.query(`DROP TYPE "matchers_operanddatatype_enum"`);
        await queryRunner.query(`ALTER TABLE "matchers" DROP COLUMN "operator"`);
        await queryRunner.query(`DROP TYPE "matchers_operator_enum"`);
        await queryRunner.query(`CREATE TYPE "matchers_type_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "matchers" ADD "type" "matchers_type_enum" NOT NULL`);
    }

}
