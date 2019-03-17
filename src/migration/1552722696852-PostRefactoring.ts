import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1552722696852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" RENAME TO "name"`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "name" RENAME TO "title"`); // reverts things made in "up" method

    }

}
