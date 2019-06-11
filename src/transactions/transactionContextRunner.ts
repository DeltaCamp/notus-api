import { createNamespace } from "cls-hooked";

const debug = require('debug')('notus:transactions:transactionContextRunner')

const context = createNamespace("__cls__context");

export function transactionContextRunner(callback: Function): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      context.run(() => {
        debug('resolving callback')
        resolve(callback())
        debug('done')
      });
    } catch (e) {
      console.log("!!!!!!!!!!!!!!!!!!!! ", e)
      reject(e)
    }
  })
}
