const PgBoss = require('pg-boss')

export class PgBossProvider {
  private pgBoss: any;

  constructor () {
    this.pgBoss = new PgBoss(process.env.DATABASE_URL)
  }

  get() {
    return this.pgBoss
  }
}