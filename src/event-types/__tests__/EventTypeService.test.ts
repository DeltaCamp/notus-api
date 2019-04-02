import { EventTypeService } from '../EventTypeService'
import { DappEntity } from '../../dapps/DappEntity'
import { VariableEntity } from '../../variables/VariableEntity'
import { EventTypeMatcherEntity } from '../../event-type-matchers/EventTypeMatcherEntity'
import { EventTypeDto } from '../../event-types/EventTypeDto'

describe('EventTypeService', () => {
  let eventTypeRepository,
      dappRepository,
      variableService,
      eventTypeMatcherService

  beforeEach(() => {
    eventTypeRepository = {
      save: jest.fn(() => Promise.resolve('saved'))
    }
    dappRepository = {
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
      eventTypeRepository,
      dappRepository,
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
        type: 'address',
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

      expect(dappRepository.findOneOrFail).toHaveBeenCalledWith(13)
      expect(eventTypeRepository.save).toHaveBeenCalledTimes(1)
      expect(variableService.createVariable).toHaveBeenCalledWith(expect.anything(), variableDto)

      expect(eventTypeMatcherService.createEventTypeMatcher).toHaveBeenCalledWith(expect.anything(), matcherDto)

      expect(eventType.eventTypeMatchers.length).toEqual(1)
      expect(eventType.variables.length).toEqual(1)
    })
  })
})
