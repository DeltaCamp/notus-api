import {
  Injectable
} from '@nestjs/common'

import { EventEntity } from '../events/EventEntity'
import { EventMatcherEntity } from './EventMatcherEntity'
import { MatcherEntity, MatcherDto, MatcherService } from '../matchers'
import { Transaction, EntityManagerProvider } from '../typeorm'

@Injectable()
export class EventMatcherService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly matcherService: MatcherService
  ) {}

  @Transaction()
  async createEventMatcher(event: EventEntity, matcherDto: MatcherDto): Promise<EventMatcherEntity> {
    const eventMatcher = new EventMatcherEntity()
    eventMatcher.matcher = await this.matcherService.createMatcher(matcherDto)
    eventMatcher.event = event

    await this.provider.get().save(eventMatcher)

    return eventMatcher;
  }

  @Transaction()
  async getMatcher(eventMatcher: EventMatcherEntity): Promise<MatcherEntity> {
    // return this.provider.get()
    //   .createQueryBuilder(MatcherEntity, 'matcher')
    //   .innerJoin('event_matchers.matcher', 'matchers')
    //   .where('event_matchers.id = :id', { id: eventMatcher.id })
    //   .printSql()
    //   .getOne()
    return null
  }
}
