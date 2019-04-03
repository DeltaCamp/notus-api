import { EventTypeService } from '../EventTypeService'
import { DappEntity } from '../../dapps/DappEntity'
import { VariableEntity } from '../../variables/VariableEntity'
import { EventTypeMatcherEntity } from '../../event-type-matchers/EventTypeMatcherEntity'
import { EventTypeDto } from '../EventTypeDto'
import { EventTypeEntity } from '../EventTypeEntity'

describe('EventTypeService', () => {
  let entityManager,
      variableService,
      eventTypeMatcherService

  beforeEach(() => {
    entityManager = {
      save: jest.fn(() => Promise.resolve('saved')),
      findOneOrFail: jest.fn(() => Promise.resolve(new DappEntity()))
    }
    variableService = {
      createVariable: jest.fn(() => Promise.resolve(new VariableEntity()))
    }
    eventTypeMatcherService = {
      createEventTypeMatcher: jest.fn(() => Promise.resolve(new EventTypeMatcherEntity()))
    }
  })

  function newService() {
    return new EventTypeService(
      { get: () => entityManager },
      variableService,
      eventTypeMatcherService
    )
  }

  describe('createEventType()', () => {
    it('should create a new EventTypeEntity', async () => {
      const service = newService()

      const matcherDto = {
        variableId: 1,
        type: 'eq',
        operand: '0x1234'
      }

      const variableDto = {
        source: 'transaction.from',
        sourceDataType: 'address',
        description: 'The address the transaction was sent from',
        isPublic: true
      }

      const eventTypeDto: EventTypeDto = {
        dappId: 13,
        name: 'Event name',
        subject: 'the subject',
        body: 'the body',
        matchers: [ matcherDto ],
        variables: [ variableDto ]
      }

      const eventType = await service.createEventType(eventTypeDto)

      expect(entityManager.findOneOrFail).toHaveBeenCalledWith(DappEntity, 13)
      expect(entityManager.save).toHaveBeenCalledTimes(1)
      expect(variableService.createVariable).toHaveBeenCalledWith(expect.anything(), variableDto)

      expect(eventTypeMatcherService.createEventTypeMatcher).toHaveBeenCalledWith(expect.anything(), matcherDto)

      expect(eventType.eventTypeMatchers.length).toEqual(1)
      expect(eventType.variables.length).toEqual(1)
    })
  })
})
