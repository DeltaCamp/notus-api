import { EventService } from '../EventService'

describe('EventService', () => {
  describe('buildSearchQuery()', () => {
    it('should format correctly', () => {
      const query = EventService.buildSearchQuery(['term1', 'term2'])
      expect(query).toEqual(`("input"."name" ILIKE :searchTerm0 OR "abi"."name" ILIKE :searchTerm0 OR "abi_event"."name" ILIKE :searchTerm0 OR "events"."title" ILIKE :searchTerm0) AND ("input"."name" ILIKE :searchTerm1 OR "abi"."name" ILIKE :searchTerm1 OR "abi_event"."name" ILIKE :searchTerm1 OR "events"."title" ILIKE :searchTerm1)`)
    })
  })

  describe('buildSearchParams()', ()=> {
    it('should build the object', () => {
      expect(EventService.buildSearchParams(['term1', 'term2'])).toEqual({
        searchTerm0: `%term1%`,
        searchTerm1: '%term2%'
      })
    })
  })
})