import { distanceInWords } from 'date-fns'

import { SingleEventTemplateView } from "./SingleEventTemplateView";
import { ActionContext } from "../engine/ActionContext";
import { EventLogEntity } from "../event-logs/EventLogEntity";

export class EmailHaltWarningView extends SingleEventTemplateView {
  constructor (
    actionContext: ActionContext,
    private readonly eventLog: EventLogEntity
  ) {
    super(actionContext.matchContext, actionContext.event)
  }

  windowDurationInWords = () => {
    return distanceInWords(this.eventLog.windowStartAt, this.eventLog.windowEndAt())
  }
}