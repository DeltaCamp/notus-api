import { Injectable, UnauthorizedException } from '@nestjs/common'

import {
  VariableEntity,
  EventTypeEntity,
  UserEntity
} from '../entities'
import { VariableDto } from './VariableDto'
import { Transaction, EntityManagerProvider } from '../typeorm'
import { VariableType } from './VariableType'

@Injectable()
export class VariableService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findOneOrFail(id): Promise<VariableEntity> {
    return this.provider.get().findOneOrFail(VariableEntity, id)
  }

  @Transaction()
  async createVariable(eventType: EventTypeEntity, variableDto: VariableDto): Promise<VariableEntity> {
    const variable = new VariableEntity();

    variable.eventType = eventType;
    variable.source = variableDto.source;
    variable.sourceDataType = variableDto.sourceDataType;
    variable.description = variableDto.description;
    variable.isPublic = variableDto.isPublic;

    await this.provider.get().save(variable)

    return variable
  }

  @Transaction()
  async updateVariable(variableDto: VariableDto): Promise<VariableEntity> {
    const variable = await this.findOneOrFail(variableDto.id)
    variable.source = variableDto.source;
    variable.sourceDataType = variableDto.sourceDataType;
    variable.description = variableDto.description;
    variable.isPublic = variableDto.isPublic;

    await this.provider.get().save(variable)

    return variable
  }

  @Transaction()
  async destroy(variable: VariableEntity) {
    await this.provider.get().delete(VariableEntity, variable.id)
  }
}
