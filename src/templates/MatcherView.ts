import { MatcherEntity } from '../entities'
import * as Source from '../matchers/Source'
import { SourceTitle } from '../matchers/SourceTitle'
import { OperatorTitle } from '../matchers/OperatorTitle'
import { formatMetaDataType } from '../utils/formatMetaDataType';
import { LogDescription } from 'ethers/utils';
import { MatchContext } from '../engine';

export class MatcherView {
  constructor (
    private readonly matcher: MatcherEntity,
    public readonly isFirst: boolean,
    public readonly isLast: boolean,
    private readonly matchContext: MatchContext
  ) {}

  sourceValue() {
    if (this.matcher.source === Source.CONTRACT_EVENT_INPUT && this.matcher.abiEventInput) {
      const logDescription: LogDescription = this.matchContext.event[this.matcher.abiEventInput.abiEvent.name]
      return formatMetaDataType(logDescription[this.matcher.abiEventInput.name], this.matcher.getMetaDataType())
    }
    return formatMetaDataType(this.matchContext.get(this.matcher.source), this.matcher.getMetaDataType())
  }

  description(): string {
    return `${this.sourceTitle()} is ${OperatorTitle[this.matcher.operator]} ${this.operand()}`
  }

  operand(): string {
    return formatMetaDataType(this.matcher.operand, this.matcher.getMetaDataType())   
  }

  sourceTitle(): string {
    if (this.matcher.source === Source.CONTRACT_EVENT_INPUT) {
      return this.matcher.abiEventInput.description()
    } else {
      return SourceTitle[this.matcher.source]
    }
  }
}