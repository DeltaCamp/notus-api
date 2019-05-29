import { UserService } from '../UserService'
import { UserEntity } from '../../entities'
import { keyHashHex } from '../../utils/keyHashHex'

describe('the test', () => {
  let userService

  let entityManager,
      mailerService,
      templateRenderer,
      subscriptionPublisher

  let user

  beforeEach(() => {
    entityManager = {
      findOne: jest.fn(() => null),
      save: jest.fn()
    };
    mailerService = {
      sendMail: jest.fn(() => Promise.resolve())
    };
    templateRenderer = {
      renderTemplate: jest.fn(),
      renderHtmlTemplate: jest.fn()
    }
    subscriptionPublisher = {
      publish: jest.fn()
    }
  })

  function newService() {
    return new UserService(
      { get: () => entityManager },
      mailerService,
      templateRenderer,
      subscriptionPublisher
    )
  }

  describe('createOrRequestMagicLink()', () => {
    it('should create a new user', async () => {
      userService = newService()

      const user = await userService.createOrRequestMagicLink('foo@bar.com')

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ subject: 'Welcome to Notus' })
      )
      expect(subscriptionPublisher.publish).toHaveBeenCalledWith({ email: 'foo@bar.com' })

      expect(user.one_time_key_hash).toBeDefined()
      expect(user.one_time_key_expires_at).toBeDefined()
    })

    describe('with an existing user', () => {
      beforeEach(async () => {
        user = new UserEntity()
        user.id = '1234'
        user.email = 'foo@bar.ca'
        entityManager = {
          findOne: jest.fn(() => user),
          save: jest.fn()
        }
      })

      it('should use the existing user and just send a magic link', async () => {
        userService = newService()

        const user = await userService.createOrRequestMagicLink('foo@bar.com')

        expect(entityManager.findOne).toHaveBeenCalledWith(UserEntity, { email: 'foo@bar.com' })
        expect(entityManager.save).toHaveBeenCalledWith(user)
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ subject: 'Your Magic Access Link'})
        )

        expect(user.one_time_key_hash).toBeDefined()
        expect(user.one_time_key_expires_at).toBeDefined()
      })
    })
  })

  describe('requestMagicLinkOrDoNothing()', () => {
    it('should do nothing if no user found', async () => {
      userService = newService()

      const user = await userService.requestMagicLinkOrDoNothing('asdf@test.com')

      expect(user).toEqual(
        null
      )
    })

    describe('with an existing user', () => {
      beforeEach(async () => {
        user = new UserEntity()
        user.id = '1234'
        user.email = 'foo@bar.ca'
        entityManager = {
          findOne: jest.fn(() => user),
          save: jest.fn()
        }
      })

      it('should use the existing user and just send a magic link', async () => {
        userService = newService()

        const user = await userService.requestMagicLinkOrDoNothing('foo@bar.com')

        expect(entityManager.findOne).toHaveBeenCalledWith(UserEntity, { email: 'foo@bar.com' })
        expect(entityManager.save).toHaveBeenCalledWith(user)
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ subject: 'Your Magic Access Link' })
        )

        expect(user.one_time_key_hash).toBeDefined()
        expect(user.one_time_key_expires_at).toBeDefined()
      })
    })
  })

  describe('confirm()', () => {
    it('should set the password', async () => {
      user = new UserEntity()
      user.email = 'fake@fake.com'
      user.generateOneTimeKey()
      let password = 'hello'
      entityManager = {
        save: jest.fn()
      }

      userService = newService()

      await userService.confirm(user, password)
      expect(user.password_hash).toEqual(keyHashHex(password))
      expect(user.one_time_key_hash).toBeNull()
      expect(user.one_time_key_expires_at).toBeNull()
      expect(entityManager.save).toHaveBeenCalledWith(user)
    })
  })
})
