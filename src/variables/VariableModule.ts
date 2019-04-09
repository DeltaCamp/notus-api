import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { VariableEntity } from '../entities'
import { VariableService } from './VariableService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VariableEntity
    ])
  ],

  providers: [
    VariableService
  ],

  exports: [
    VariableService
  ]
})
export class VariableModule {}
