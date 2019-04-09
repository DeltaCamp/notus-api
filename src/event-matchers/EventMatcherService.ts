import {
  Injectable
} from '@nestjs/common'

import { EventEntity, EventMatcherEntity, MatcherEntity } from '../entities'
import { MatcherDto } from '../matchers/MatcherDto'
import { EventMatcherDto } from './EventMatcherDto'
import { MatcherService } from '../matchers/MatcherService'
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
  async update(eventMatcherDto: EventMatcherDto): Promise<EventMatcherEntity> {
    await this.matcherService.update(eventMatcherDto.matcher)
    return await this.findOneOrFail(eventMatcherDto.id)
  }

  @Transaction()
  async destroyEventMatcher(eventMatcher: EventMatcherEntity) {
    await this.matcherService.destroy(eventMatcher.matcherId)
    await this.provider.get().delete(EventMatcherEntity, eventMatcher.id)
  }

  @Transaction()
  async findOneOrFail(eventMatcherId: number) {
    return await this.provider.get().findOneOrFail(EventMatcherEntity, eventMatcherId)
  }

  @Transaction()
  async getMatcher(eventMatcher: EventMatcherEntity): Promise<MatcherEntity> {
    return await this.matcherService.findOne(eventMatcher.matcherId)
  }
}
