import { EmailActionHandler } from '../EmailActionHandler'
import { MatchContext } from '../MatchContext';
import { ActionContext } from '../ActionContext';

describe('EmailActionHandler', () => {

  let handler

  let templateRenderer, mailJobPublisher, eventLogService, eventService

  let eventLog
  
  beforeEach(() => {
    eventLog = {
      isWindowFull: jest.fn(() => false)
    }

    templateRenderer = {
      renderTemplate: jest.fn((templateName: string, view: any) => templateName),
      renderHtmlTemplate: jest.fn((templateName: string, view: any) => templateName)
    }

    mailJobPublisher = {
      sendMail: jest.fn()
    }

    eventLogService = {
      logEvent: jest.fn(() => eventLog),
      sendWarning: jest.fn()
    }

    eventService = {
      haltEmails: jest.fn()
    }

    handler = new EmailActionHandler(templateRenderer, mailJobPublisher, eventLogService, eventService)
  })

  describe('handle()', () => {
    let block, user, event

    let actionContext

    beforeEach(() => {
      block = {
        number: 9999
      }
  
      let matchContext = new MatchContext(block)

      user = {
        id: 1,
        email: 'fake@fake.com'
      }

      event = {
        title: 'custom event title',
        user,
        hasEmailAction: jest.fn(() => true),
        formatTitle: () => 'formattedTitle'
      }

      actionContext = new ActionContext(matchContext, event)
    })

    it('should work', async () => {
      await handler.handle(user, [actionContext])

      expect(templateRenderer.renderTemplate).toHaveBeenCalledWith('event.template.text.mst', expect.objectContaining({
        events: [expect.anything()]
      }))
      expect(templateRenderer.renderHtmlTemplate).toHaveBeenCalledWith('event.template.html.mst', expect.objectContaining({
        events: [expect.anything()]
      }))

      expect(mailJobPublisher.sendMail).toHaveBeenCalledWith({
        to: 'fake@fake.com',
        subject: `${event.title} occurred in block ${block.number}`,
        text: 'event.template.text.mst',
        html: 'event.template.html.mst'
      })
    })

    describe('when emails are maxed', async () => {

      beforeEach(() => {
        eventLog.isWindowFull = jest.fn(() => true)
        eventLog.warningSent = false
      })
      
      it('should send a unsubscribe warning', async () => {
        await handler.handle(user, [actionContext])

        expect(templateRenderer.renderTemplate).toHaveBeenCalledWith('email_halt_warning.text.mst', expect.objectContaining({
          eventLog
        }))
        
        expect(templateRenderer.renderHtmlTemplate).toHaveBeenCalledWith('email_halt_warning.html.mst', expect.objectContaining({
          eventLog
        }))

        expect(eventLogService.sendWarning).toHaveBeenCalledWith(eventLog)

        expect(eventService.haltEmails).toHaveBeenCalledWith(event)

        expect(mailJobPublisher.sendMail).toHaveBeenCalledWith(expect.objectContaining({
          subject: `Emails for "formattedTitle" have been suspended`
        }))
      })
    })
  })
})
