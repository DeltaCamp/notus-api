import { MatcherEntity } from '../entities'
import * as Source from '../matchers/Source'
import { SourceTitle } from '../matchers/SourceTitle'
import { OperatorTitle } from '../matchers/OperatorTitle'
import { formatMetaDataType } from '../utils/formatMetaDataType';

export class MatcherView {
  constructor (
    private readonly matcher: MatcherEntity,
    public readonly isFirst: boolean,
    public readonly isLast: boolean
  ) {}

  description(): string {
    return `${this.source()} is ${OperatorTitle[this.matcher.operator]} ${this.operand()}`
  }

  operand(): string {
    return formatMetaDataType(this.matcher.operand, this.matcher.getMetaDataType())   
  }

  source(): string {
    if (this.matcher.source === Source.CONTRACT_EVENT_INPUT) {
      return this.matcher.abiEventInput.description()
    } else {
      return SourceTitle[this.matcher.source]
    }
  }
}