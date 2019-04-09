import { Module } from '@nestjs/common';

import { EntityManagerProvider } from './EntityManagerProvider'

@Module({
  providers: [
    EntityManagerProvider
  ],

  exports: [
    EntityManagerProvider
  ]
})
export class TransactionModule {}
