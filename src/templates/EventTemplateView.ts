import { BaseView } from '../templates/BaseView'
import { SingleEventTemplateView } from './SingleEventTemplateView';

export class EventTemplateView extends BaseView {
  
  constructor (
    public readonly events: SingleEventTemplateView[]
  ) {
    super()
  }

}