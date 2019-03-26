import { DappUserService } from '../DappUserService'
import { DappUserEntity } from '../DappUserEntity'
import { DappEntity } from '../../dapps/DappEntity'
import { UserEntity } from '../../users/UserEntity'
import { newKeyAscii } from '../../utils/newKeyAscii'
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
    dapp.name = 'My Dapp'

    dappRepository = {
      findOneOrFail: jest.fn(() => dapp)
    };
    userRepository = {
      find: jest.fn(() => [])
    };
    dappUserRepository = {
      find: jest.fn(() => []),
      save: jest.fn()
    };
    mailerService = {
      sendMail: jest.fn()
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
          find: jest.fn(() => [user])
        }
      })

      it('should use the existing user', async () => {
        dappUserService = newService()

        const dappUser = await dappUserService.create('1', 'foo@bar.com')

        expect(userRepository.find).toHaveBeenCalledWith({ email: 'foo@bar.com' })
        expect(dappUserRepository.save).toHaveBeenCalledWith(dappUser)

        expect(dappUser.request_key).toBeDefined()
        expect(dappUser.request_key_expires_at).toBeDefined()
      })

      describe('with an existing dappuser ', () => {
        it('should use an existing dappUser', async () => {
          dappUser = {
            generateRequestKey: jest.fn(() => newKeyAscii())
          }
          dappUserRepository = {
            find: jest.fn(() => [dappUser]),
            save: jest.fn()
          }

          dappUserService = newService()

          await dappUserService.create('1', 'foo@bar.com')

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

      await dappUserService.confirm(Buffer.from(requestKey, 'ascii').toString('hex'))

      expect(dappUserRepository.findOneOrFail).toHaveBeenCalledWith({ requestKey: sha256(requestKey).toString('ascii') })
      expect(dappUser.access_key).toBeDefined()
      expect(dappUserRepository.save).toHaveBeenCalledWith(dappUser)
    })
  })
})
