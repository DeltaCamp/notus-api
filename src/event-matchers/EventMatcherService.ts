import {
  Injectable
} from '@nestjs/common'
import {
  InjectRepository
} from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { EventEntity } from '../events/EventEntity'
import { EventMatcherEntity } from './EventMatcherEntity'
import { MatcherDto } from '../matchers/MatcherDto'
import { MatcherService } from '../matchers/MatcherService'

@Injectable()
export class EventMatcherService {

  constructor (
    @InjectRepository(EventMatcherEntity)
    private readonly eventMatcherRepository: Repository<EventMatcherEntity>,
    private readonly matcherService: MatcherService
  ) {}

  async createEventMatcher(event: EventEntity, matcherDto: MatcherDto): Promise<EventMatcherEntity> {
    const eventMatcher = new EventMatcherEntity()
    eventMatcher.matcher = await this.matcherService.createMatcher(matcherDto)
    eventMatcher.event = event

    await this.eventMatcherRepository.save(eventMatcher)

    return eventMatcher;
  }
}
