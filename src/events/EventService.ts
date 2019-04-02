import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { EventEntity } from './EventEntity'
import { EventDto } from './EventDto'
import { EventTypeService } from '../event-types/EventTypeService'
import { EventMatcherService } from '../event-matchers/EventMatcherService'

@Injectable()
export class EventService {

  constructor (
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly eventTypeService: EventTypeService,
    private readonly eventMatcherService: EventMatcherService
  ) {}

  async findOne(id): Promise<EventEntity> {
    return this.eventRepository.findOne(id, { relations: ['user'] })
  }

  async createEvent(eventDto: EventDto): Promise<EventEntity> {
    const event = new EventEntity()

    event.eventType =
      await this.eventTypeService.findOneOrFail(eventDto.eventTypeId)
    event.name = eventDto.name

    event.eventMatchers = await Promise.all(eventDto.matchers.map(matcherDto => (
      this.eventMatcherService.createEventMatcher(event, matcherDto)
    )))

    await this.eventRepository.save(event)

    return event
  }
}
