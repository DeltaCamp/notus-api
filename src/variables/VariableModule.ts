import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { VariableEntity } from '../entities'
import { VariableService } from './VariableService'
import { VariableResolver } from './VariableResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VariableEntity
    ])
  ],

  providers: [
    VariableService, VariableResolver
  ],

  exports: [
    VariableService
  ]
})
export class VariableModule {}
