import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'
import { BlockJobRunner } from './BlockJobRunner';

@Injectable()
export class JobRunnerManager {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly mailJobRunner: MailJobRunner,
    private readonly blockJobRunner: BlockJobRunner
  ) {}

  async start() {
    await this.provider.get().start()
    await this.mailJobRunner.start()
    await this.blockJobRunner.start()
  }

}