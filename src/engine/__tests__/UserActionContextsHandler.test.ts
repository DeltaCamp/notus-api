import { UserActionContextsHandler } from '../UserActionContextsHandler'
import { MatchContext } from '../MatchContext';
import { ActionContext } from '../ActionContext';

describe('UserActionContextsHandler', () => {

  let handler

  let templateRenderer, mailJobPublisher
  
  beforeEach(() => {
    templateRenderer = {
      renderTemplate: jest.fn((templateName: string, view: any) => templateName),
      renderHtmlTemplate: jest.fn((templateName: string, view: any) => templateName)
    }

    mailJobPublisher = {
      sendMail: jest.fn()
    }

    handler = new UserActionContextsHandler(templateRenderer, mailJobPublisher)
  })

  describe('handle()', () => {
    let block, user, event

    it('should work', async () => {
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
        user
      }

      let actionContext = new ActionContext(matchContext, event)
  
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
  })
})
