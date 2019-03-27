import { NestFactory, HttpAdapterHost } from '@nestjs/core';

import { AppModule } from './AppModule';
import { RollbarExceptionsFilter } from './filters/RollbarExceptionsFilter';
import { rollbar } from './rollbar';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.CORS_ALLOWED_ORIGINS  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new RollbarExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT);
}

bootstrap().catch(e => rollbar.error(e))
