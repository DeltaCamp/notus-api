import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConfirmedColumnToDappUser1553629007674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE dapp_users
      ADD COLUMN confirmed bool
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE dapp_users
      DROP COLUMN IF EXISTS confirmed
    `)
  }
}
