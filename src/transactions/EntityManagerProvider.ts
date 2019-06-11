import { EntityManager, getManager } from "typeorm";
import { getNamespace } from "cls-hooked";

const debug = require('debug')('notus:transactions:EntityManagerProvider')

export class EntityManagerProvider {
  get(): EntityManager {
    // let context = getNamespace("__cls__context");
    // debug('Context defined: ', !!context)
    // if (context && context.active) {
    //   debug('Context active')
    //   let transactionalEntityManager = context.get("__typeOrm__transactionalEntityManager");
    //   if (transactionalEntityManager) {
    //     debug('transactionEntityManager is defined')
    //     // At this point here we have successfully found a transactional EntityManager
    //     // that was previously saved within the current context.
    //     // We now use this EntityManager to work.
    //     return transactionalEntityManager;
    //   } else {
    //     debug('transactionEntityManager is NOT defined')
    //   }
    // } else {
    //   debug('Context not active')
    // }

    // No specific transactional EntityManager has been found : we use the global EntityManager to work.
    return getManager();
  }
}
