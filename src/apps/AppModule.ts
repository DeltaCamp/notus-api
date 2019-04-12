import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEntity } from '../entities';
import { AppResolver } from './AppResolver';
import { AppService } from './AppService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppEntity
    ])
  ],
  providers: [
    AppService, AppResolver
  ],

  exports: [
    AppService
  ]
})
export class AppModule {}
