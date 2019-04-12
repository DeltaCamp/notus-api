import { Injectable } from '@nestjs/common';

import {
  RecipeEntity,
  UserEntity,
  EventEntity,
  EventMatcherEntity
} from '../entities'
import { EventDto } from './EventDto'
import { EventMatcherService } from '../event-matchers/EventMatcherService'
import { Transaction, EntityManagerProvider } from '../typeorm'

@Injectable()
export class EventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly eventMatcherService: EventMatcherService
  ) {}

  @Transaction()
  async findOne(id): Promise<EventEntity> {
    return this.provider.get().findOne(EventEntity, id)
  }

  @Transaction()
  async findOneOrFail(id): Promise<EventEntity> {
    return this.provider.get().findOneOrFail(EventEntity, id)
  }

  @Transaction()
  async findForUser(user: UserEntity): Promise<EventEntity[]> {
    return this.provider.get().find(EventEntity, { user })
  }

  @Transaction()
  async findAllForMatch(): Promise<EventEntity[]> {
    return this.provider.get().find(EventEntity, {
      relations: [
        'user',
        'eventMatchers',
        'eventMatchers.matcher',
        'recipe',
        'recipe.recipeMatchers',
        'recipe.recipeMatchers.matcher'
      ]
    })
  }

  @Transaction()
  async getUser(event: EventEntity): Promise<UserEntity> {
    return this.provider.get().createQueryBuilder()
      .select('users')
      .from(UserEntity, 'users')
      .innerJoin('users.events', 'events')
      .where('events.id = :id', { id: event.id })
      .getOne()
  }

  @Transaction()
  async getRecipe(event: EventEntity): Promise<RecipeEntity> {
    return this.provider.get().createQueryBuilder()
      .select('recipes')
      .from(RecipeEntity, 'recipes')
      .innerJoin('recipes.events', 'events')
      .where('events.id = :id', { id: event.id })
      .getOne()
  }

  @Transaction()
  async getEventMatchers(event: EventEntity): Promise<EventMatcherEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('event_matchers')
      .from(EventMatcherEntity, 'event_matchers')
      .innerJoin('event_matchers.event', 'events')
      .where('events.id = :id', { id: event.id })
      .printSql()
      .getMany()
  }

  @Transaction()
  async createEvent(user: UserEntity, eventDto: EventDto): Promise<EventEntity> {
    const event = new EventEntity()
    const em = this.provider.get()

    event.user = user;
    event.recipe =
      await em.findOneOrFail(RecipeEntity, eventDto.recipeId)
    await em.save(event)

    event.eventMatchers = await Promise.all(eventDto.matchers.map(matcherDto => (
      this.eventMatcherService.createEventMatcher(event, matcherDto)
    )))

    return event
  }

  @Transaction()
  async destroy(event: EventEntity): Promise<boolean> {
    await Promise.all(event.eventMatchers.map(eventMatcher => {
      return this.eventMatcherService.destroy(eventMatcher)
    }))

    await this.provider.get().delete(EventEntity, event.id)
    return true
  }
}
