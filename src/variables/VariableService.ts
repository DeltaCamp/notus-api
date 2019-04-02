import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { VariableEntity } from './VariableEntity'
import { VariableDto } from './VariableDto'
import { EventTypeEntity } from '../event-types/EventTypeEntity'

@Injectable()
export class VariableService {

  constructor (
    @InjectRepository(VariableEntity)
    private readonly variableRepository: Repository<VariableEntity>
  ) {}

  async findOne(id): Promise<VariableEntity> {
    return this.variableRepository.findOneOrFail(id)
  }

  async createVariable(eventType: EventTypeEntity, variableDto: VariableDto): Promise<VariableEntity> {

    const variable = new VariableEntity();

    variable.eventType = eventType;
    variable.source = variableDto.source;
    variable.sourceDataType = variableDto.sourceDataType;
    variable.description = variableDto.description;
    variable.isPublic = variableDto.isPublic;

    await this.variableRepository.save(variable)

    return variable
  }
}
