import { BaseTemplateView } from '../templates/BaseTemplateView'
import { SingleEventTemplateView } from './SingleEventTemplateView';

export class EventTemplateView extends BaseTemplateView {
  
  constructor (
    public readonly events: SingleEventTemplateView[]
  ) {
    super()
  }

}