import { NestFactory, HttpAdapterHost } from '@nestjs/core';

import { ApplicationModule } from './ApplicationModule';
import { RollbarExceptionsFilter } from './filters/RollbarExceptionsFilter';
import { rollbar } from './rollbar';
import { PgBossProvider } from './jobs/PgBossProvider'

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  app.enableCors({ origin: process.env.CORS_ALLOWED_ORIGINS  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new RollbarExceptionsFilter(httpAdapter));

  const provider = app.get(PgBossProvider)
  await provider.get().start()

  await app.listen(process.env.PORT);
}

bootstrap().catch(e => rollbar.error(e))
