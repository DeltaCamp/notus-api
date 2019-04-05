import { IProcessor } from 'typeorm-fixtures-cli'
import { EventTypeEntity } from '../src/event-types/EventTypeEntity'

export default class EventTypeProcessor implements IProcessor<EventTypeEntity> {
  postProcess(name: string, object: { [key: string]: any }): void {
    // console.log(name)
    // console.log(object)
    // console.log(typeof object)
  }
}
