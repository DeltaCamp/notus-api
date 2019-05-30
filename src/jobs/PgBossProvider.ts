const PgBoss = require('pg-boss')

export class PgBossProvider {
  private pgBoss: any;

  constructor () {
    this.pgBoss = new PgBoss({
      connectionString: process.env.DATABASE_URL,
      archiveCompletedJobsEvery: "15 minutes",
      archiveCheckIntervalMinutes: 15,
      deleteArchivedJobsEvery: "30 minutes"
    })
  }

  get() {
    return this.pgBoss
  }
}