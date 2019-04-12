// import { RecipeService } from '../RecipeService'
import { DappEntity } from '../../entities'
// import { VariableEntity, VariableType, SourceDataType } from '../../variables'
// import { RecipeMatcherEntity } from '../../recipe-matchers/RecipeMatcherEntity'
// import { RecipeDto } from '../RecipeDto'
// import { RecipeEntity } from '../RecipeEntity'
// import { Operator } from '../../matchers'

describe('RecipeService', () => {
  let entityManager,
      variableService,
      recipeMatcherService

  beforeEach(() => {
    entityManager = {
      save: jest.fn(() => Promise.resolve('saved')),
      findOneOrFail: jest.fn(() => Promise.resolve(new DappEntity()))
    }
    // variableService = {
    //   createVariable: jest.fn(() => Promise.resolve(new VariableEntity()))
    // }
    // recipeMatcherService = {
    //   createRecipeMatcher: jest.fn(() => Promise.resolve(new RecipeMatcherEntity()))
    // }
  })

  // function newService() {
  //   return new RecipeService(
  //     { get: () => entityManager },
  //     variableService,
  //     recipeMatcherService
  //   )
  // }

  describe('createRecipe()', () => {
    it('should create a new RecipeEntity', async () => {
      // const service = newService()
      //
      // const matcherDto = {
      //   variableId: 1,
      //   type: Operator.EQ,
      //   operand: '0x1234'
      // }
      //
      // const variableDto = {
      //   source: VariableType.TRANSACTION_FROM,
      //   sourceDataType: SourceDataType.ADDRESS,
      //   description: 'The address the transaction was sent from',
      //   isPublic: true
      // }
      //
      // const recipeDto: RecipeDto = {
      //   dappId: 13,
      //   name: 'Event name',
      //   subject: 'the subject',
      //   body: 'the body',
      //   matchers: [ matcherDto ],
      //   variables: [ variableDto ]
      // }
      //
      // const recipe = await service.createRecipe(recipeDto)
      //
      // expect(entityManager.findOneOrFail).toHaveBeenCalledWith(DappEntity, 13)
      // expect(entityManager.save).toHaveBeenCalledTimes(1)
      // expect(variableService.createVariable).toHaveBeenCalledWith(expect.anything(), variableDto)
      //
      // expect(recipeMatcherService.createRecipeMatcher).toHaveBeenCalledWith(expect.anything(), matcherDto)
      //
      // expect(recipe.recipeMatchers.length).toEqual(1)
      // expect(recipe.variables.length).toEqual(1)
    })
  })
})
