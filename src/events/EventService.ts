import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  UserEntity,
  EventEntity,
  AbiEventEntity,
  MatcherEntity
} from '../entities'
import { EventScope } from './EventScope'
import { EventDto } from './EventDto'
import { MatcherService } from '../matchers/MatcherService'
import { Transaction, EntityManagerProvider } from '../transactions'
import { AppService } from '../apps/AppService';
import { AbiEventService } from '../abis/AbiEventService'

@Injectable()
export class EventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly matcherService: MatcherService,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
    private readonly abiEventService: AbiEventService
  ) {}

  @Transaction()
  async findOne(id: number): Promise<EventEntity> {
    return this.provider.get().findOne(EventEntity, id)
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<EventEntity> {
    return this.provider.get().findOneOrFail(EventEntity, id)
  }

  @Transaction()
  async findForUser(user: UserEntity): Promise<EventEntity[]> {
    return this.provider.get().createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect("events.user", "users")
      .leftJoinAndSelect("events.matchers", "matchers")
      .where('"events"."deletedAt" IS NULL AND "events"."userId" = :id', { id: user.id })
      .orderBy('"events"."createdAt"', 'DESC')
      .getMany()
  }

  @Transaction()
  async findPublic(): Promise<EventEntity[]> {
    return await this.provider.get().createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect("events.user", "users")
      .leftJoinAndSelect("events.matchers", "matchers")
      .where('"events"."isPublic" IS TRUE AND "events"."parentId" IS NULL AND "events"."deletedAt" IS NULL')
      .orderBy('"events"."createdAt"', 'DESC')
      .getMany()
  }

  @Transaction()
  async findAllForMatch(): Promise<EventEntity[]> {
    return await this.provider.get().createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect("events.user", "users")
      .leftJoinAndSelect("events.matchers", "matchers")
      .leftJoinAndSelect("matchers.abiEventInput", "input")
      .leftJoinAndSelect("input.abiEvent", "abi_event")
      .leftJoinAndSelect("abi_event.abi", "abi")
      .where('"events"."isActive" IS TRUE AND "events"."deletedAt" IS NULL')
      .getMany()
  }

  @Transaction()
  async getUser(event: EventEntity): Promise<UserEntity> {
    return this.provider.get().createQueryBuilder()
      .select('users')
      .from(UserEntity, 'users')
      .innerJoin('users.events', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .getOne()
  }

  @Transaction()
  async getAbiEvent(event: EventEntity): Promise<AbiEventEntity> {
    return this.provider.get().createQueryBuilder(AbiEventEntity, 'abiEvents')
      .innerJoin('abiEvents.events', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .getOne()
  }

  @Transaction()
  async getMatchers(event: EventEntity): Promise<MatcherEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('matchers')
      .from(MatcherEntity, 'matchers')
      .innerJoin('matchers.event', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .getMany()
  }

  @Transaction()
  async createEvent(user: UserEntity, eventDto: EventDto): Promise<EventEntity> {
    const em = this.provider.get()

    const event = new EventEntity()

    const appDto = eventDto.app
    if (appDto && (appDto.id || appDto.name)) {
      event.app = await this.appService.findOrCreate(user, eventDto.app)
    }

    const parentDtoId = eventDto.parentId
    if (parentDtoId) {
      event.parent = await this.findOneOrFail(parentDtoId)
    }

    if (eventDto.abiEventId) {
      event.abiEvent = await this.abiEventService.findOneOrFail(eventDto.abiEventId)
    }

    event.user = user;
    event.title = eventDto.title
    event.scope = eventDto.scope
    event.isPublic = eventDto.isPublic

    await em.save(event)

    event.matchers = await Promise.all(eventDto.matchers.map(matcherDto => (
      this.matcherService.createMatcher(event, matcherDto)
    )))

    return event
  }

  @Transaction()
  async findByScope(scope: EventScope): Promise<EventEntity[]> {
    return await this.provider.get().createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect('events.user', 'users')
      .leftJoinAndSelect('events.parent', 'parent_events')
      .leftJoinAndSelect('events.abiEvent', 'abiEvents')
      .leftJoinAndSelect('events.matchers', 'matchers')
      .leftJoinAndSelect('matchers.abiEventInput', 'abiEventInputs')
      .where('(events.scope = :scope OR parent_events.scope = :scope)', { scope })
      .andWhere('events.deletedAt IS NULL')
      .andWhere('events.isActive IS TRUE')
      .getMany()
  }

  @Transaction()
  async updateEvent(eventDto: EventDto): Promise<EventEntity> {
    const event = await this.findOneOrFail(eventDto.id)

    new Array(
      'title', 
      'isActive', 
      'isPublic', 
      'scope'
    ).forEach(attr => {
      if (eventDto[attr] !== undefined) {
        event[attr] = eventDto[attr]
      }
    })

    if (eventDto.parentId !== undefined) {
      event.parent = await this.findOneOrFail(eventDto.parentId)
    }

    if (eventDto.abiEventId !== undefined) {
      event.abiEvent = await this.abiEventService.findOneOrFail(eventDto.abiEventId)
    }

    await this.provider.get().save(event)

    return event
  }

  @Transaction()
  async deleteEvent(eventId: number): Promise<EventEntity> {
    const event = await this.findOneOrFail(eventId)
    event.deletedAt = new Date

    await this.provider.get().save(event)
    return event
  }
}
