import { EventTypeResolver } from '../EventTypeResolver'

import { UserEntity } from '../../entities'
import { EventTypeDto } from '../EventTypeDto'

describe('EventTypeResolver', () => {
  let resolver;

  let eventTypeService, user, eventTypeDto

  beforeEach(() => {
    eventTypeService = {
      findOne: jest.fn(() => null),
      createEventType: jest.fn()
    };

    eventTypeDto = new EventTypeDto()

    resolver = new EventTypeResolver(eventTypeService)
  })

  it('should call createEventType', async () => {
    await resolver.createEventType(user, eventTypeDto)

    expect(eventTypeService.createEventType).toHaveBeenCalledWith(eventTypeDto)
  })
})
