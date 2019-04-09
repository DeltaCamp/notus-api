import {
  Injectable
} from '@nestjs/common'

import { EventEntity, EventMatcherEntity, MatcherEntity } from '../entities'
import { MatcherDto, MatcherService } from '../matchers'
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
    return await this.matcherService.findOne(eventMatcher.matcherId)
  }
}
