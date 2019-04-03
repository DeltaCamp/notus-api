import {
  Injectable
} from '@nestjs/common'
import {
  InjectRepository
} from '@nestjs/typeorm'

import { EventEntity } from '../events/EventEntity'
import { EventMatcherEntity } from './EventMatcherEntity'
import { MatcherDto } from '../matchers/MatcherDto'
import { MatcherService } from '../matchers/MatcherService'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'

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
}
