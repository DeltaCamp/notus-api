import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1555350905885 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "matchers_operanddatatype_enum" RENAME TO "matchers_operanddatatype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "matchers_operanddatatype_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`ALTER TABLE "matchers" ALTER COLUMN "operandDataType" TYPE "matchers_operanddatatype_enum" USING "operandDataType"::"text"::"matchers_operanddatatype_enum"`);
        await queryRunner.query(`DROP TYPE "matchers_operanddatatype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "matchers_operanddatatype_enum_old" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`ALTER TABLE "matchers" ALTER COLUMN "operandDataType" TYPE "matchers_operanddatatype_enum_old" USING "operandDataType"::"text"::"matchers_operanddatatype_enum_old"`);
        await queryRunner.query(`DROP TYPE "matchers_operanddatatype_enum"`);
        await queryRunner.query(`ALTER TYPE "matchers_operanddatatype_enum_old" RENAME TO "matchers_operanddatatype_enum"`);
    }

}
