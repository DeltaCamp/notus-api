import { createNamespace } from "cls-hooked";

const context = createNamespace("__cls__context");

export function transactionContextRunner(callback: Function): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      context.run(() => {
        resolve(callback())
      });
    } catch (e) {
      console.log("!!!!!!!!!!!!!!!!!!!! ", e)
      reject(e)
    }
  })
}
