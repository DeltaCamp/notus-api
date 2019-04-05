import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './WorkerModule';
import { BlockListenerManager } from './engine'
import { rollbar } from './rollbar';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  const blockListenerManager = app.get(BlockListenerManager)
  await blockListenerManager.start()
}

bootstrap().catch(e => rollbar.error(e))
