import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator'
import { ValidationException } from '../common/ValidationException'

import { notDefined } from '../utils/notDefined'
import {
  UserEntity,
  EventEntity,
  AbiEventEntity,
  WebhookHeaderEntity,
  MatcherEntity
} from '../entities'
import { Network } from '../networks/Network'
import { EventScope } from './EventScope'
import { EventDto } from './EventDto'
import { MatcherService } from '../matchers/MatcherService'
import { Transaction, EntityManagerProvider } from '../transactions'
import { AppService } from '../apps/AppService';
import { AbiEventService } from '../abis/AbiEventService'
import { EventsQuery } from './EventsQuery'
import { ContractService } from '../contracts/ContractService'
import { newKeyHex } from '../utils/newKeyHex';
import { WebhookHeaderService } from './WebhookHeaderService';

const debug = require('debug')('notus:events:EventService')

@Injectable()
export class EventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly matcherService: MatcherService,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
    private readonly abiEventService: AbiEventService,
    private readonly contractService: ContractService,
    private readonly webhookHeaderService: WebhookHeaderService
  ) {}

  @Transaction()
  async findOne(id: number): Promise<EventEntity> {
    return this.provider.get().findOne(EventEntity, id)
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<EventEntity> {
    if (notDefined(id)) {
      throw new Error(`id must be defined`)
    }
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
      .addOrderBy("matchers.order", "ASC")
      .getMany()
  }

  @Transaction()
  async getWebhookHeaders(event: EventEntity): Promise<WebhookHeaderEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('webhook_headers')
      .from(WebhookHeaderEntity, 'webhook_headers')
      .innerJoin('webhook_headers.event', 'events')
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

    if (eventDto.contractId) {
      event.contract = await this.contractService.findOneOrFail(eventDto.contractId)
    }

    event.user = user;
    event.title = eventDto.title
    event.scope = eventDto.scope
    event.isPublic = eventDto.isPublic
    event.runCount = eventDto.runCount
    event.webhookUrl = eventDto.webhookUrl
    event.webhookBody = eventDto.webhookBody
    event.callWebhook = eventDto.callWebhook
    event.networkId = eventDto.networkId

    debug(eventDto)

    if (eventDto.color !== undefined) {
      event.color = eventDto.color
    }
    if (eventDto.sendEmail !== undefined) {
      event.sendEmail = eventDto.sendEmail
    }

    event.disableEmailKey = newKeyHex()

    await this.validateEvent(event)

    await em.save(event)

    event.matchers = await Promise.all((eventDto.matchers || []).map(matcherDto => (
      this.matcherService.createMatcher(event, matcherDto)
    )))

    event.webhookHeaders = await Promise.all((eventDto.webhookHeaders || []).map(webhookHeaderDto => {
      return this.webhookHeaderService.createOrUpdate(event, webhookHeaderDto)
    }))

    return event
  }

  async findByScope(scope: EventScope, networkId: Network): Promise<EventEntity[]> {
    return await this.provider.get().createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect('events.contract', 'contracts')
      .leftJoinAndSelect('events.user', 'users')
      .leftJoinAndSelect('events.abiEvent', 'abiEvents')
      .leftJoinAndSelect('events.webhookHeaders', 'webhook_headers')
      .leftJoinAndSelect('abiEvents.abi', 'abis')
      .leftJoinAndSelect('events.matchers', 'matchers')
      .leftJoinAndSelect('matchers.abiEventInput', 'abiEventInputs')
      .leftJoinAndSelect('abiEventInputs.abiEvent', 'aei_abiEvents')
      .leftJoinAndSelect('aei_abiEvents.abi', 'aei_abis')
      .where('(events.scope = :scope)', { scope })
      .andWhere('("events"."networkId" = :networkId)', { networkId })
      .andWhere('"events"."deletedAt" IS NULL')
      .andWhere('"events"."isActive" IS TRUE')
      .andWhere('("events"."sendEmail" IS TRUE OR "events"."callWebhook" IS TRUE)')
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

    if (eventDto.contractId !== undefined) {
      if (eventDto.contractId !== null) {
        event.contract = await this.contractService.findOneOrFail(eventDto.contractId)
      } else {
        event.contract = null
      }
    }

    if (eventDto.networkId !== undefined) {
      event.networkId = eventDto.networkId
    }

    if (eventDto.color !== undefined) {
      event.color = eventDto.color
    }

    if (eventDto.sendEmail !== undefined) {
      event.sendEmail = eventDto.sendEmail
    }

    if (eventDto.abiEventId !== undefined) {
      if (eventDto.abiEventId !== null) {
        event.abiEvent = await this.abiEventService.findOneOrFail(eventDto.abiEventId)
      } else {
        event.abiEvent = null
      }
    }

    if (eventDto.webhookUrl !== undefined) {
      if (eventDto.webhookUrl) {
        event.webhookUrl = eventDto.webhookUrl
      } else {
        event.webhookUrl = null
      }
    }

    if (eventDto.webhookBody !== undefined) {
      if (eventDto.webhookBody) { // if not null or empty string
        event.webhookBody = eventDto.webhookBody
      } else {
        event.webhookBody = null
      }
    }

    if (eventDto.callWebhook !== undefined) {
      event.callWebhook = eventDto.callWebhook
    }

    await this.validateEvent(event)

    await this.provider.get().save(event)

    if (eventDto.matchers !== undefined) {
      await Promise.all(eventDto.matchers.map(matcherDto => (
        this.matcherService.createOrUpdate(event, matcherDto)
      )))
    }

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
    const errors: ValidationError[] = await validate(event)

    if (event.contract && event.contract.networkId !== event.networkId) {
      errors.push({
        target: event,
        property: 'contract',
        value: event.contract.networkId,
        constraints: { // Constraints that failed validation with error messages.
            'contract': '$property does not have same networkId as event'
        },
        children: []
      })
    }

    if (errors.length > 0) {
      throw new ValidationException(`Event is invalid`, errors)
    }
  }

  async disableEventEmail(disableEmailKey: string): Promise<EventEntity> {
    const event = await this.provider.get().findOneOrFail(EventEntity, { disableEmailKey })
    event.sendEmail = false
    await this.provider.get().save(event)
    return event
  }

  @Transaction()
  async haltEmails(event: EventEntity) {
    event.sendEmail = false
    await this.provider.get().save(event)
  }
}
