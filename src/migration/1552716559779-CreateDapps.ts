import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDapps1552716559779 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE 'dapps' ('id' SERIAL NOT NULL, 'name' character varying NOT NULL, CONSTRAINT 'PK_d429b7114371f6a35c5cb4776a7' PRIMARY KEY ('id'))`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE 'dapps'`);
  }

}