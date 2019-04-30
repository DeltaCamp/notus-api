const PgBoss = require('pg-boss')

export class PgBossProvider {
  private pgBoss: any;

  constructor () {
    this.pgBoss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
      deleteArchivedJobsEvery: "4 hours"
    })
  }

  get() {
    return this.pgBoss
  }
}