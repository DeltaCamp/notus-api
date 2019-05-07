import { BaseTemplateView } from './BaseTemplateView'

export class MagicLinkView extends BaseTemplateView {

  constructor (
    public readonly oneTimeKey: string
  ) {
    super()
  }
}