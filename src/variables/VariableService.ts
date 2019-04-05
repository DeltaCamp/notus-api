import { Injectable } from '@nestjs/common'

import { VariableEntity } from './VariableEntity'
import { VariableDto } from './VariableDto'
import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'
import { VariableType } from './VariableType'

@Injectable()
export class VariableService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findOne(id): Promise<VariableEntity> {
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
}
