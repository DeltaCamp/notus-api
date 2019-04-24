import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'

@Injectable()
export class JobRunnerManager {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly mailJobRunner: MailJobRunner
  ) {}

  async start() {
    await this.provider.get().start()
    await this.mailJobRunner.start()
  }

}