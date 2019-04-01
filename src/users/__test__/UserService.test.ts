import { UserService } from '../UserService'
import { UserEntity } from '../UserEntity'
import { newKeyHex } from '../../utils/newKeyHex'
import { keyHashHex } from '../../utils/keyHashHex'

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

      expect(user.one_time_key_hash).toBeDefined()
      expect(user.one_time_key_expires_at).toBeDefined()
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

        expect(user.one_time_key_hash).toBeDefined()
        expect(user.one_time_key_expires_at).toBeDefined()
      })
    })
  })

  describe('confirm()', () => {
    it('should set the password', async () => {
      user = new UserEntity()
      user.generateOneTimeKey()
      let password = 'hello'
      userRepository = {
        save: jest.fn()
      }

      userService = newService()

      await userService.confirm(user, password)
      expect(user.password_hash).toEqual(keyHashHex(password))
      expect(user.one_time_key_hash).toBeNull()
      expect(user.one_time_key_expires_at).toBeNull()
      expect(userRepository.save).toHaveBeenCalledWith(user)
    })
  })
})
