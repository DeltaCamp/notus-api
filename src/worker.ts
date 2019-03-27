import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './WorkerModule';
import { WorkerNotificationManager } from './worker/WorkerNotificationManager'
import { rollbar } from './rollbar';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  const workerNotificationManager = app.get(WorkerNotificationManager)
  await workerNotificationManager.start()
}

bootstrap().catch(e => rollbar.error(e))
