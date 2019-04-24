import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './WorkerModule';
import { BlockListenerManager } from './engine'
import { rollbar } from './rollbar';
import { JobRunnerManager } from './jobs/JobRunnerManager';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  const jobRunnerManager = app.get(JobRunnerManager)
  await jobRunnerManager.start()
  const blockListenerManager = app.get(BlockListenerManager)
  await blockListenerManager.start()
}

bootstrap().catch(e => rollbar.error(e))
