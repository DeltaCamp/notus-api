import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { VariableEntity } from './VariableEntity'
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
