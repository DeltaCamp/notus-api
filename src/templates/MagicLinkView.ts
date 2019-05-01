import { BaseView } from './BaseView'

export class MagicLinkView extends BaseView {

  constructor (
    public readonly oneTimeKey: string
  ) {
    super()
  }
}