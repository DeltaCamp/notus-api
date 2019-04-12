import { BlockHandler } from '../BlockHandler'

import {
  EventEntity,
  RecipeEntity,
  RecipeMatcherEntity,
  EventMatcherEntity,
  MatcherEntity
} from '../../entities'

describe('BlockHandler', () => {
  let blockHandler

  let events, matchHandler, matcher
  let block, transaction, log

  let event, recipe, recipeMatcher, eventMatcher
  let matcher1, matcher2

  beforeEach(() => {
    matcher1 = new MatcherEntity()
    matcher2 = new MatcherEntity()
    recipeMatcher = new RecipeMatcherEntity()
    recipeMatcher.matcher = matcher1

    eventMatcher = new EventMatcherEntity()
    eventMatcher.matcher = matcher2

    event = new EventEntity()
    recipe = new RecipeEntity()
    recipe.recipeMatchers = [recipeMatcher]
    event.recipe = recipe
    event.eventMatchers = [eventMatcher]

    events = [event]

    matchHandler = {
      handle: jest.fn()
    }

    matcher = {
      matches: jest.fn()
    }

    block = {}
    transaction = {}
    log = {}

    blockHandler = new BlockHandler(matchHandler, matcher)
  })

  describe('handleBlock()', () => {
    it('should not call the match handler if a matcher fails', async () => {
      await blockHandler.handleBlock(events, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    it('should call the matcher when all matchers pass', async () => {
      matcher.matches = jest.fn(() => true)
      await blockHandler.handleBlock(events, block, transaction, log)
      expect(matchHandler.handle).toHaveBeenCalled()
    })
  })
})
