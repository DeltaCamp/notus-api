import { EntityManager, getManager } from "typeorm";
import { getNamespace } from "cls-hooked";

export class EntityManagerProvider {
  get(): EntityManager {
    let context = getNamespace("__cls__context");
    if (context && context.active) {
      let transactionalEntityManager = context.get("__typeOrm__transactionalEntityManager");
      if (transactionalEntityManager) {
        // At this point here we have successfully found a transactional EntityManager
        // that was previously saved within the current context.
        // We now use this EntityManager to work.
        return transactionalEntityManager;
      }
    }

    // No specific transactional EntityManager has been found : we use the global EntityManager to work.
    return getManager();
  }
}
