import { createNamespace } from "cls-hooked";

const context = createNamespace("__cls__context");

export function transactionContextRunner(callback: Function) {
  context.run(() => callback());
}
