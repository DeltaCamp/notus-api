import { DappUserService } from '../DappUserService'
import { DappUserEntity } from '../DappUserEntity'
import { DappEntity } from '../../dapps/DappEntity'
import { UserEntity } from '../../users/UserEntity'
import { newKeyHex } from '../../utils/newKeyHex'
import { sha256 } from '../../utils/sha256'

describe('the test', () => {
  let dappUserService

  let dappUserRepository,
      dappRepository,
      userRepository,
      mailerService

  let dapp, user, dappUser

  beforeEach(() => {
    dapp = new DappEntity()
    dapp.id = '1'
    dapp.name = 'My Dapp'

    dappRepository = {
      findOneOrFail: jest.fn(() => dapp),
      save: jest.fn()
    };
    userRepository = {
      findOne: jest.fn(() => null)
    };
    dappUserRepository = {
      findOne: jest.fn(() => null),
      save: jest.fn()
    };
    mailerService = {
      sendMail: jest.fn(() => Promise.resolve())
    };
  })

  function newService() {
    return new DappUserService(
      dappUserRepository,
      dappRepository,
      userRepository,
      mailerService
    )
  }

  describe('create()', () => {
    it('should throw if no dapp exists', async () => {
      dappRepository = {
        findOneOrFail: async () => { throw new Error('could not find') }
      }

      dappUserService = newService()

      expect(dappUserService.create('1', 'foo@bar.com')).rejects.toEqual(new Error('could not find'))
    })

    describe('with an existing user', () => {
      beforeEach(async () => {
        user = new UserEntity()
        user.id = '1234'
        user.email = 'foo@bar.ca'
        userRepository = {
          findOne: jest.fn(() => user)
        }
      })

      it('should use the existing user', async () => {
        dappUserService = newService()

        const dappUser = await dappUserService.create('1', null, 'foo@bar.com')

        expect(userRepository.findOne).toHaveBeenCalledWith({ email: 'foo@bar.com' })
        expect(dappUserRepository.save).toHaveBeenCalledWith(dappUser)

        expect(dappUser.request_key).toBeDefined()
        expect(dappUser.request_key_expires_at).toBeDefined()
        expect(dappUser.owner).toBeFalsy()
      })

      describe('with an existing dappuser ', () => {
        it('should use an existing dappUser', async () => {
          dappUser = {
            generateRequestKey: jest.fn(() => newKeyHex())
          }
          dappUserRepository = {
            findOne: jest.fn(() => dappUser),
            save: jest.fn()
          }

          dappUserService = newService()

          await dappUserService.create('1', 'foo@bar.com')

          expect(dappUserRepository.findOne).toHaveBeenCalledWith({ dapp, user })
          expect(dappUserRepository.save).toHaveBeenCalledWith(dappUser)
          expect(dappUser.generateRequestKey).toHaveBeenCalled()
          expect(mailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
            to: 'foo@bar.ca',
            subject: 'Welcome - Confirm Your Subscription to My Dapp',
            template: 'confirmation.template.pug',
            text: 'Confirmation subscription to My Dapp'
          }))
        })
      })
    })

    it('should create a new dapp if a dappName is passed', async () => {

      dappUserService = newService()

      let dappUser = await dappUserService.create(null, 'asdf', 'foo@bar.com')

      expect(dappRepository.save)
        .toHaveBeenCalledWith(expect.objectContaining({ name: 'asdf'}))
      expect(dappUserRepository.save).toHaveBeenCalledWith(dappUser)
      expect(dappUser.owner).toBeTruthy()
      expect(mailerService.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        template: 'send_api_key.template.pug'
      }))
    })
  })

  describe('confirm()', () => {
    it('should generate a new access key', async () => {
      dappUser = new DappUserEntity()
      const requestKey = dappUser.generateRequestKey()
      dappUserRepository = {
        findOneOrFail: jest.fn(() => dappUser),
        save: jest.fn()
      }

      dappUserService = newService()

      await dappUserService.confirm(requestKey)

      expect(dappUserRepository.findOneOrFail).toHaveBeenCalledWith({ request_key: sha256(requestKey).toString('hex') })
      expect(dappUser.access_key).toBeDefined()
      expect(dappUserRepository.save).toHaveBeenCalledWith(dappUser)
    })
  })
})
