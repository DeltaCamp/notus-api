import * as tk from 'timekeeper'
import { addSeconds } from 'date-fns'

import { UserEntity } from '../UserEntity'

describe('UserEntity', () => {
  let user, now

  let initialOneTimeExpiresIn

  beforeEach(() => {
    now = new Date()
    user = new UserEntity()
    tk.freeze(now)
    initialOneTimeExpiresIn = process.env.ONE_TIME_KEY_EXPIRES_IN
    process.env.ONE_TIME_KEY_EXPIRES_IN = '300'
  })

  afterEach(() => {
    tk.reset()
    process.env.ONE_TIME_KEY_EXPIRES_IN = initialOneTimeExpiresIn
  })

  describe('generateOneTimeKey()', () => {
    it('should generate a new key', () => {
      expect(user.one_time_key_hash).toBeUndefined()
      expect(user.one_time_key_expires_at).toBeUndefined()
      user.generateOneTimeKey()
      expect(user.one_time_key_hash).toBeDefined()
      expect(user.one_time_key_hash.length).toEqual(64)
      expect(user.one_time_key_expires_at).toEqual(addSeconds(now, 300))
    })
  })

  describe('clearOneTimeKey()', () => {
    it('should generate the access key only if the request key is correct', () => {
      const oneTimeKey = user.generateOneTimeKey()
      expect(user.one_time_key_hash).toBeDefined()
      expect(user.one_time_key_expires_at).toBeDefined()
      user.clearOneTimeKey(oneTimeKey)
      expect(user.one_time_key_hash).toBeNull()
      expect(user.one_time_key_expires_at).toBeNull()
    })
  })
})
