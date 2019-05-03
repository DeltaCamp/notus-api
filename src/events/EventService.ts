import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'class-validator'
import { ValidationException } from '../common/ValidationException'

import { notDefined } from '../utils/notDefined'
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
import { EventsQuery } from './EventsQuery'

const debug = require('debug')('notus:events:EventService')

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
    if (notDefined(id)) { throw new Error(`id must be defined`) }
    return this.provider.get().findOneOrFail(EventEntity, id)
  }

  @Transaction()
  async findAndCount(params: EventsQuery) {
    let query = await this.provider.get().createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect("events.user", "users")
      .leftJoinAndSelect("events.matchers", "matchers")
      .leftJoinAndSelect("matchers.abiEventInput", "input")
      .leftJoinAndSelect("input.abiEvent", "abi_event")
      .leftJoinAndSelect("abi_event.abi", "abi")

    query = query.where('"events"."deletedAt" IS NULL')

    if (params) {
      if (params.userId) {
        query = query.andWhere('"events"."userId" = :id', { id: params.userId })
      }
      if (params.isPublic) {
        query = query.andWhere('"events"."isPublic" IS TRUE')
      }
      if (params.skip) {
        query = query.offset(params.skip)
      }
      if (params.take) {
        query = query.limit(params.take)
      }

      if (params.searchTerms) {
        const searchTerms = params.searchTerms.split(/\s+/)
        query = query.andWhere(EventService.buildSearchQuery(searchTerms), EventService.buildSearchParams(searchTerms))
      }
    }

    return query.printSql().orderBy('"events"."createdAt"', 'DESC').getManyAndCount()
  }

  // static joinSearchQuery<Entity>(query: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity> {
  //   return query.leftJoinAndSelect("events.user", "users")
  //     .leftJoinAndSelect("events.matchers", "matchers")
  //     .leftJoinAndSelect("matchers.abiEventInput", "input")
  //     .leftJoinAndSelect("input.abiEvent", "abi_event")
  //     .leftJoinAndSelect("abi_event.abi", "abi")
  // }

  static buildSearchParams(searchTerms: string[]): any {
    return searchTerms.reduce((params, searchTerm, index) => {
      params[`searchTerm${index}`] = `%${searchTerm}%`
      return params
    }, {})
  }

  static buildSearchQuery(searchTerms: string[]): string {
    let searchQuery = '('
    let isFirst = true

    searchTerms.forEach((searchTerm, index) => {
      const variableTitle = `searchTerm${index}`
      if (!isFirst) {
        searchQuery = `${searchQuery} OR `
      } else {
        isFirst = false
      }
      searchQuery =
        `${searchQuery}("input"."name" ILIKE :${variableTitle} OR "abi"."name" ILIKE :${variableTitle} OR "abi_event"."name" ILIKE :${variableTitle} OR "events"."title" ILIKE :${variableTitle})`
    })

    return `${searchQuery})`
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
    event.runCount = eventDto.runCount
    event.webhookUrl = eventDto.webhookUrl
    event.webhookBody = eventDto.webhookBody

    await this.validateEvent(event)

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
      .leftJoinAndSelect('events.abiEvent', 'abiEvents')
      .leftJoinAndSelect('abiEvents.abi', 'abis')
      .leftJoinAndSelect('events.matchers', 'matchers')
      .leftJoinAndSelect('matchers.abiEventInput', 'abiEventInputs')
      .leftJoinAndSelect('abiEventInputs.abiEvent', 'aei_abiEvents')
      .leftJoinAndSelect('aei_abiEvents.abi', 'aei_abis')
      .where('(events.scope = :scope)', { scope })
      .andWhere('"events"."deletedAt" IS NULL')
      .andWhere('"events"."isActive" IS TRUE')
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

    if (eventDto.runCount !== undefined) {
      event.runCount = eventDto.runCount
    }

    if (eventDto.parentId !== undefined) {
      event.parent = await this.findOneOrFail(eventDto.parentId)
    }

    if (eventDto.abiEventId !== undefined) {
      event.abiEvent = await this.abiEventService.findOneOrFail(eventDto.abiEventId)
    }

    if (eventDto.matchers !== undefined) {
      await Promise.all(eventDto.matchers.map(matcherDto => (
        this.matcherService.update(matcherDto)
      )))
    }

    if (eventDto.webhookUrl !== undefined) {
      event.webhookUrl = eventDto.webhookUrl
    }

    if (eventDto.webhookBody !== undefined) {
      event.webhookBody = eventDto.webhookBody
    }
      
    await this.validateEvent(event)

    await this.provider.get().save(event)

    return event
  }

  @Transaction()
  async deactivateEvent(event: EventEntity) {
    event.isActive = false
    await this.provider.get().save(event)
    return true
  }

  @Transaction()
  async deleteEvent(eventId: number): Promise<EventEntity> {
    const event = await this.findOneOrFail(eventId)
    event.deletedAt = new Date

    await this.provider.get().save(event)
    return event
  }

  async validateEvent(event: EventEntity) {
    let errors = await validate(event)
    if (errors.length > 0) {
      throw new ValidationException(`Event is invalid`, errors)
    }
  }
}
