import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator'
import { ValidationException } from '../common/ValidationException'
import { InjectConnection } from '@nestjs/typeorm'

import { notDefined } from '../utils/notDefined'
import {
  UserEntity,
  EventEntity,
  AbiEventEntity,
  WebhookHeaderEntity,
  MatcherEntity
} from '../entities'
import { Network } from '../networks/Network'
import { EventDto } from './EventDto'
import { MatcherService } from '../matchers/MatcherService'
import { AppService } from '../apps/AppService';
import { AbiEventService } from '../abis/AbiEventService'
import { EventsQuery } from './EventsQuery'
import { ContractService } from '../contracts/ContractService'
import { newKeyHex } from '../utils/newKeyHex';
import { WebhookHeaderService } from './WebhookHeaderService';
import { EventLogService } from '../event-logs/EventLogService';
import { NetworkName } from '../networks/NetworkName'
import { EventScope } from './EventScope'
import { Connection } from 'typeorm';
import { Service } from '../Service';

// const debug = require('debug')('notus:events:EventService')

@Injectable()
export class EventService extends Service {

  constructor (
    private readonly matcherService: MatcherService,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
    private readonly abiEventService: AbiEventService,
    private readonly contractService: ContractService,
    private readonly webhookHeaderService: WebhookHeaderService,
    private readonly eventLogService: EventLogService,
    @InjectConnection()
    connection: Connection
  ) {
    super(connection)
  }

  async findOne(id: number): Promise<EventEntity> {
    return this.manager().findOne(EventEntity, id)
  }

  async findOneOrFail(id: number): Promise<EventEntity> {
    if (notDefined(id)) {
      throw new Error(`id must be defined`)
    }
    return this.manager().findOneOrFail(EventEntity, id)
  }

  async findAndCount(params: EventsQuery) {
    let query = await this.connection.createQueryBuilder(EventEntity, 'events')
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

  async findForUser(user: UserEntity): Promise<EventEntity[]> {
    return this.connection.createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect("events.user", "users")
      .leftJoinAndSelect("events.matchers", "matchers")
      .where('"events"."deletedAt" IS NULL AND "events"."userId" = :id', { id: user.id })
      .orderBy('"events"."createdAt"', 'DESC')
      .getMany()
  }

  async findPublic(): Promise<EventEntity[]> {
    return await this.connection.createQueryBuilder(EventEntity, 'events')
      .leftJoinAndSelect("events.user", "users")
      .leftJoinAndSelect("events.matchers", "matchers")
      .where('"events"."isPublic" IS TRUE AND "events"."parentId" IS NULL AND "events"."deletedAt" IS NULL')
      .orderBy('"events"."createdAt"', 'DESC')
      .getMany()
  }

  async getUser(event: EventEntity): Promise<UserEntity> {
    return this.connection.createQueryBuilder()
      .select('users')
      .from(UserEntity, 'users')
      .innerJoin('users.events', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .getOne()
  }

  async getAbiEvent(event: EventEntity): Promise<AbiEventEntity> {
    return this.connection.createQueryBuilder(AbiEventEntity, 'abiEvents')
      .innerJoin('abiEvents.events', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .getOne()
  }

  async getMatchers(event: EventEntity): Promise<MatcherEntity[]> {
    return this.connection.createQueryBuilder()
      .select('matchers')
      .from(MatcherEntity, 'matchers')
      .innerJoin('matchers.event', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .addOrderBy("matchers.order", "ASC")
      .getMany()
  }

  async getWebhookHeaders(event: EventEntity): Promise<WebhookHeaderEntity[]> {
    return this.connection.createQueryBuilder()
      .select('webhook_headers')
      .from(WebhookHeaderEntity, 'webhook_headers')
      .innerJoin('webhook_headers.event', 'events')
      .where('"events"."id" = :id', { id: event.id })
      .getMany()
  }

  async createEvent(user: UserEntity, eventDto: EventDto): Promise<EventEntity> {
    const em = this.manager()

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
    return await this.connection.createQueryBuilder(EventEntity, 'events')
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
      .andWhere('"events"."runCount" != 0')
      .andWhere('"users"."confirmedAt" IS NOT NULL')
      .andWhere('("events"."sendEmail" IS TRUE OR ("events"."callWebhook" IS TRUE AND "events"."webhookUrl" IS NOT NULL))')
      .getMany()
  }

  async updateEvent(eventDto: EventDto): Promise<EventEntity> {
    const event = await this.findOneOrFail(eventDto.id)

    new Array(
      'title', 
      'isPublic', 
    ).forEach(attr => {
      if (eventDto[attr] !== undefined) {
        event[attr] = eventDto[attr]
      }
    })

    if (eventDto.scope !== undefined) {
      event.scope = eventDto.scope
      if (eventDto.scope !== EventScope.CONTRACT_EVENT) {
        event.contract = null
        event.contractId = null
      }
    }

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
      // If we are re-activating then reset the event log
      if (!event.sendEmail && eventDto.sendEmail) {
        this.eventLogService.reset(event)
      }
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

    await this.manager().save(event)

    if (eventDto.matchers !== undefined) {
      await Promise.all(eventDto.matchers.map(matcherDto => (
        this.matcherService.createOrUpdate(event, matcherDto)
      )))
    }

    return event
  }

  async decrementRunCount(event: EventEntity) {
    event.runCount = event.runCount - 1
    await this.manager().save(event)
    return true
  }

  async deleteEvent(eventId: number): Promise<EventEntity> {
    const event = await this.findOneOrFail(eventId)
    event.deletedAt = new Date

    await this.manager().save(event)
    return event
  }

  async validateEvent(event: EventEntity) {
    const errors: ValidationError[] = await validate(event)

    if (event.contractId || event.contract) {
      const contract = event.contract || (await this.contractService.findOneOrFail(event.contractId))
      if (contract && contract.networkId !== event.networkId) {
        errors.push({
          target: event,
          property: 'contract',
          value: contract.networkId,
          constraints: { // Constraints that failed validation with error messages.
              'contract': `${contract.name} is on ${NetworkName[contract.networkId]}`
          },
          children: []
        })
      }
    }

    if (errors.length > 0) {
      throw new ValidationException(`Event is invalid`, errors)
    }
  }

  async disableEventEmail(disableEmailKey: string): Promise<EventEntity> {
    const event = await this.manager().findOneOrFail(EventEntity, { disableEmailKey })
    event.sendEmail = false
    await this.manager().save(event)
    return event
  }

  async haltEmails(event: EventEntity) {
    event.sendEmail = false
    await this.manager().save(event)
  }
}
