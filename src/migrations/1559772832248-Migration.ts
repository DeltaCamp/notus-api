import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1559772832248 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "abi_event_inputs" ADD "title" text`);
        await queryRunner.query(`UPDATE "abi_event_inputs" SET "title" = "name"`)
        await queryRunner.query(`ALTER TABLE "abi_event_inputs" ALTER COLUMN "title" SET NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "abi_event_inputs" DROP COLUMN "title"`);
    }

}
