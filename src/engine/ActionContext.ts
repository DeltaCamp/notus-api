import { MatchContext } from './MatchContext'
import { EventEntity } from '../entities'

export class ActionContext {
  constructor(
    public readonly matchContext: MatchContext,
    public readonly event: EventEntity
  ) {}
}