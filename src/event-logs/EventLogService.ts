import { Injectable } from '@nestjs/common'

import { Transaction, EntityManagerProvider } from '../transactions'
import { EventEntity, EventLogEntity } from '../entities';

const debug = require('debug')('notus:event-logs:EventLogService')

debug('HELLO!')

@Injectable()
export class EventLogService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async logEvent(event: EventEntity): Promise<EventLogEntity> {
    debug('log event')
    let eventLog = await this.provider.get().findOne(EventLogEntity, { eventId: event.id })
    if (!eventLog) {
      eventLog = new EventLogEntity()
      eventLog.event = event
      eventLog.resetWindow()
    }
    if (eventLog.isWindowExpired()) {
      eventLog.resetWindow()
    }
    eventLog.addToWindow()
    await this.provider.get().save(eventLog)
    return eventLog
  }

  @Transaction()
  async reset(event: EventEntity): Promise<EventLogEntity> {
    let eventLog = await this.provider.get().findOne(EventLogEntity, { eventId: event.id })
    if (eventLog) {
      eventLog.resetWindow()
    }
    return eventLog
  }

  @Transaction()
  async sendWarning(eventLog: EventLogEntity) {
    eventLog.warningSent = true
    await this.provider.get().save(eventLog)
    debug('sendWarning: ', eventLog)
  }
}