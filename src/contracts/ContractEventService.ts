import { Injectable } from '@nestjs/common'

import {
  ContractEntity,
  ContractEventEntity,
  ContractEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'

@Injectable()
export class ContractEventService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async find(name: string, topic: string): Promise<ContractEventEntity[]> {
    let query = this.provider.get().createQueryBuilder()
      .select('contractEvents')
      .from(ContractEventEntity, 'contractEvents')

    if (name) {
      query = query.where('"contractEvents"."name" = :name', { name })
    }

    if (topic) {
      query = query.where('"contractEvents"."topic" = :topic', { topic })
    }
      
    return query.getMany()
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<ContractEventEntity> {
    return await this.provider.get().findOneOrFail(ContractEventEntity, id)
  }

  @Transaction()
  async findContractEvents(contract: ContractEntity): Promise<ContractEventEntity[]> {
    return await this.provider.get().find(ContractEventEntity, { contractId: contract.id })
  }
  
  @Transaction()
  async findContractEventInputs(contractEvent: ContractEventEntity): Promise<ContractEventInputEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('contractEventInputs')
      .from(ContractEventInputEntity, 'contractEventInputs')
      .innerJoin('contractEventInputs.contractEvent', 'contractEvents')
      .where('"contractEvents"."id" = :id', { id: contractEvent.id })
      .getMany()
  }
}