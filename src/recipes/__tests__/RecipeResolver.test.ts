import { RecipeResolver } from '../RecipeResolver'

import { UserEntity } from '../../entities'
import { RecipeDto } from '../RecipeDto'
import { DappDto } from '../../dapps/DappDto'

describe('RecipeResolver', () => {
  let recipeService, user, recipeDto, dappUserService

  beforeEach(() => {
    user = {
      id: 1234
    }

    recipeService = {
      findOne: jest.fn(() => null),
      createRecipe: jest.fn()
    };

    dappUserService = {
      isOwner: jest.fn(() => true)
    }

    recipeDto = new RecipeDto()
    recipeDto.dapp = new DappDto()
    recipeDto.dapp.id = 9999
  })

  function newResolver() {
    return new RecipeResolver(recipeService, dappUserService)
  }

  describe('createRecipe()', () => {
    it('should create the Recipe when the user is the dapp owner', async () => {
      const resolver = newResolver()
      await resolver.createRecipe(user, recipeDto)
      expect(recipeService.createRecipe).toHaveBeenCalledWith(user, recipeDto)
    })

    it('should not create the Recipe when the user is not he owner', async () => {
      dappUserService.isOwner = jest.fn(() => false)
      const resolver = newResolver()
      let failed = false
      try {
        await resolver.createRecipe(user, recipeDto)
      } catch (error) {
        failed = true
      }
      expect(failed).toBeTruthy()
    })
  })
})
