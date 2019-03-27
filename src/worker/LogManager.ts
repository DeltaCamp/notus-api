import { ILogManager } from './ILogManager'

export class LogManager implements ILogManager {
  public pushLog(id: string, log: Object) {
    console.log(`${id}: `, log)
  }
}
