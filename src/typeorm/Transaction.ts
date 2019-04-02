// Transaction.ts file
import { getConnection, getManager } from "typeorm";
import { getNamespace } from "cls-hooked";

// taken from https://github.com/typeorm/typeorm/issues/1895#issuecomment-471901958

export function Transaction(connectionName: string = "default"): MethodDecorator {
  return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {

    // save original method - we gonna need it
    const originalMethod = descriptor.value;

    // override method descriptor with proxy method
    descriptor.value = async function(...args: any[]) {

      const context = getNamespace("__cls__context");

      if (!context) {
        // This will happen if no CLS namespace has been initialied in your app.
        // At application startup, you need to create a CLS namespace using createNamespace(...) function.
        throw new Error("No CLS namespace defined in your app ... Cannot use CLS transaction management.");
      }

      if (!context.active) {
        // This will happen if your code has not been executed using the run(...) function of your CLS
        // namespace.
        // Example: the code triggered in your app by an entry HTTP request (or whatever other entry event,
        // like one triggered by a message dropped in a queue your app is listening at), should be wrapped
        // using the run(...) function of your CLS namespace.
        // Using run(...) ensures that an active context is set, where you can safely store and retrieve
        // things.
        throw new Error("No CLS active context detected ... Cannot use CLS transaction management.")
      }

      // From here everything is OK to use CLS to manage our transaction.

      // We check if a transaction has already been started
      let transactionalEntityManager = context.get("__typeOrm__transactionalEntityManager");

      if (!transactionalEntityManager) {

        // No existing transaction. We now use one ...

        return await getConnection(connectionName).transaction(async entityManager => {

          // We store the EntityManager managing our current transaction.
          context.set("__typeOrm__transactionalEntityManager", entityManager);

          // We can now call the function that had been decorated with the Transaction decorator.
          let result = await originalMethod.apply(this, [...args]);

          // We just finished working with the EntityManager managing our transaction: we remove it
          // from the current context.
          context.set("__typeOrm__transactionalEntityManager", null);

          return result;

        });
      }
      else {

        // A transaction has already been started. We just call the function.

        return await originalMethod.apply(this, [...args]);
      }
    };

  };
}
