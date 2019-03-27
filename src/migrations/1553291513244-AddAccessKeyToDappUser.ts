import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAccessKeyToDappUser1553291513244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE dapp_users
      ADD COLUMN access_key text,
      ADD COLUMN access_key_expires_at timestamptz,
      ADD COLUMN request_key text,
      ADD COLUMN request_key_expires_at timestamptz
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE dapp_users
      DROP COLUMN IF EXISTS access_key,
      DROP COLUMN IF EXISTS access_key_expires_at,
      DROP COLUMN IF EXISTS request_key,
      DROP COLUMN IF EXISTS request_key_expires_at
    `)
  }
}
