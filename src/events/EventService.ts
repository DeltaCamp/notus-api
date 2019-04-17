import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  UserEntity,
  EventEntity,
  ContractEventEntity,
  MatcherEntity
} from '../entities'
import { EventScope } from './EventScope'
import { EventDto } from './EventDto'
import { MatcherService } from '../matchers/MatcherService'
import { Transaction, EntityManagerProvider } from '../transactions'
import { AppService } from '../apps/AppService';
import { ContractEventService } from '../contracts/ContractEventService'

@Injectable()
export class EventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly matcherService: MatcherService,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
    private readonly contractEventService: ContractEventService
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
      .leftJoinAndSelect("matchers.contractEventInput", "input")
      .leftJoinAndSelect("input.contractEvent", "contract_event")
      .leftJoinAndSelect("contract_event.contract", "contract")
      .where('"events"."deletedAt" IS NULL')
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
  async getContractEvent(event: EventEntity): Promise<ContractEventEntity> {
    return this.provider.get().createQueryBuilder(ContractEventEntity, 'contractEvents')
      .innerJoin('contractEvents.events', 'events')
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

    if (eventDto.contractEventId) {
      event.contractEvent = await this.contractEventService.findOneOrFail(eventDto.contractEventId)
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
      .leftJoin('events.parent', 'parent_events')
      .where('events.scope = :scope OR parent_events.scope = :scope', { scope })
      .getMany()
  }

  @Transaction()
  async updateEvent(eventDto: EventDto): Promise<EventEntity> {
    const event = await this.findOneOrFail(eventDto.id)
    event.title = eventDto.title;
    event.isPublic = eventDto.isPublic
    event.scope = eventDto.scope
    
    const parentDtoId = eventDto.parentId
    if (parentDtoId) {
      event.parent = await this.findOneOrFail(parentDtoId)
    }

    if (eventDto.contractEventId) {
      event.contractEvent = await this.contractEventService.findOneOrFail(eventDto.contractEventId)
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
