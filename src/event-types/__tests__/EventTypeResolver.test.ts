import { EventTypeResolver } from '../EventTypeResolver'

import { UserEntity } from '../../entities'
import { EventTypeDto } from '../EventTypeDto'

describe('EventTypeResolver', () => {
  let eventTypeService, user, eventTypeDto, dappUserService

  beforeEach(() => {
    user = {
      id: 1234
    }

    eventTypeService = {
      findOne: jest.fn(() => null),
      createEventType: jest.fn()
    };

    dappUserService = {
      isOwner: jest.fn(() => true)
    }

    eventTypeDto = new EventTypeDto()
  })

  function newResolver() {
    return new EventTypeResolver(eventTypeService, dappUserService)
  }

  describe('createEventType()', () => {
    it('should create the EventType when the user is the dapp owner', async () => {
      const resolver = newResolver()
      await resolver.createEventType(user, eventTypeDto)
      expect(eventTypeService.createEventType).toHaveBeenCalledWith(eventTypeDto)
    })

    it('should not create the EventType when the user is not he owner', async () => {
      dappUserService.isOwner = jest.fn(() => false)
      const resolver = newResolver()
      let failed = false
      try {
        await resolver.createEventType(user, eventTypeDto)
      } catch (error) {
        failed = true
      }
      expect(failed).toBeTruthy()
    })
  })
})
