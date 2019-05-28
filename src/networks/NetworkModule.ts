import { Module } from '@nestjs/common'

import { NetworkResolver } from './NetworkResolver'

@Module({
  imports: [],

  providers: [
    NetworkResolver
  ],

  exports: []
})
export class NetworkModule {}
