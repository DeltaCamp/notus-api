import { Module } from '@nestjs/common';

import { DateScalar } from './DateScalar'

@Module({
  providers: [
    DateScalar
  ]
})
export class CommonModule {}
