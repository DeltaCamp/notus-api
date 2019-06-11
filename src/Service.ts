import { Connection, EntityManager } from 'typeorm'

export class Service {
  constructor(
    protected readonly connection: Connection
  ) {}

  manager() {
    return this.connection.manager
  }

  async transaction(callback: (transactionalEntityManager: EntityManager) => Promise<unknown>, transactionalEntityManager?: EntityManager): Promise<unknown> {
    if (transactionalEntityManager) { 
      return callback(transactionalEntityManager)
    } else {
      return await this.manager().transaction(callback)
    }
  }
}
