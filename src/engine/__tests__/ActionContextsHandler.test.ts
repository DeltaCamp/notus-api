import { ActionContextsHandler } from '../ActionContextsHandler'
import { MatchContext } from '../MatchContext';

describe('ActionContextsHandler', () => {

  let handler

  let userActionContextsHandler

  beforeEach(() => {
    userActionContextsHandler = {
      handle: jest.fn()
    }

    handler = new ActionContextsHandler(userActionContextsHandler)
  })

  describe('handle()', () => {
    it('should work', async () => {

      let matchContext = new MatchContext()
  
      let user1 = {
        id: 1
      }

      let user2 = {
        id: 2
      }

      let actionContext1 = {
        matchContext,
        event: {
          user: user1
        }
      }
  
      let actionContext2 = {
        matchContext,
        event: {
          user: user2
        }
      }
  
      let actionContext3 = {
        matchContext,
        event: {
          user: user1
        }
      }
  
      let actionContexts = [
        actionContext1, actionContext2, actionContext3
      ]
      
      await handler.handle(actionContexts)

      expect(userActionContextsHandler.handle).toHaveBeenCalledWith(user1, [actionContext1, actionContext3])
      expect(userActionContextsHandler.handle).toHaveBeenCalledWith(user2, [actionContext2])
    })
  })
})