import { UserService } from '../UserService'
import { UserEntity } from '../UserEntity'
import { newKeyHex } from '../../utils/newKeyHex'
import { sha256 } from '../../utils/sha256'

describe('the test', () => {
  let userService

  let userRepository,
      mailerService

  let user

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(() => null),
      save: jest.fn()
    };
    mailerService = {
      sendMail: jest.fn(() => Promise.resolve())
    };
  })

  function newService() {
    return new UserService(
      userRepository,
      mailerService
    )
  }

  describe('createOrRequestMagicLink()', () => {
    it('should create a new user', async () => {
      userService = newService()

      const user = await userService.createOrRequestMagicLink('foo@bar.com')

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ subject: 'Welcome to Notus Network' })
      )

      expect(user.access_request_key_hash).toBeDefined()
      expect(user.request_key_expires_at).toBeDefined()
    })

    describe('with an existing user', () => {
      beforeEach(async () => {
        user = new UserEntity()
        user.id = '1234'
        user.email = 'foo@bar.ca'
        userRepository = {
          findOne: jest.fn(() => user),
          save: jest.fn()
        }
      })

      it('should use the existing user and just send a magic link', async () => {
        userService = newService()

        const user = await userService.createOrRequestMagicLink('foo@bar.com')

        expect(userRepository.findOne).toHaveBeenCalledWith({ email: 'foo@bar.com' })
        expect(userRepository.save).toHaveBeenCalledWith(user)
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ subject: 'Your Magic Access Link'})
        )

        expect(user.access_request_key_hash).toBeDefined()
        expect(user.request_key_expires_at).toBeDefined()
      })
    })
  })

  describe('confirm()', () => {
    it('should generate a new access key', async () => {
      user = new UserEntity()
      const requestKey = user.generateRequestKey()
      userRepository = {
        findOneOrFail: jest.fn(() => user),
        save: jest.fn()
      }

      userService = newService()

      await userService.confirm(requestKey)

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({ access_request_key_hash: sha256(requestKey).toString('hex') })
      expect(user.access_key_hash).toBeDefined()
      expect(user.access_request_key_hash).toBeNull()
      expect(userRepository.save).toHaveBeenCalledWith(user)
    })
  })
})
