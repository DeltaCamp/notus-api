import { MatcherEntity } from '../entities'
import { LogDescription } from 'ethers/utils';
import * as Source from '../matchers/Source'
import { formatMetaDataType } from '../utils/formatMetaDataType';

export class AbiEventView {
  public readonly name: string;

  constructor (
    private readonly log: LogDescription,
    private readonly matchers: MatcherEntity[]
  ) {
    this.name = log.name
    matchers.forEach(matcher => {
      if (matcher.source === Source.CONTRACT_EVENT_INPUT && matcher.abiEventInput) {
        const { name, metaType } = matcher.abiEventInput
        const value = log[name]
        this[name] = formatMetaDataType(value, metaType)
      }
    })
  }
}