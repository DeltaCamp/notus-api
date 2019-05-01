import { BaseView } from '../templates/BaseView'

export class EventTemplateView extends BaseView {
  
  constructor (
    public readonly events: string[]
  ) {
    super()
  }

}