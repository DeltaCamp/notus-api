import * as tk from 'timekeeper'
import { addHours } from 'date-fns'

import { DappUserEntity } from '../DappUserEntity'

describe('DappUserEntity', () => {
  let dappUser, now

  beforeEach(() => {
    now = new Date()
    dappUser = new DappUserEntity()
    tk.freeze(now)
  })

  afterEach(() => {
    tk.reset()
  })

  describe('generateRequestKey()', () => {
    it('should generate a new key', () => {
      expect(dappUser.request_key).toBeUndefined()
      expect(dappUser.request_key_expires_at).toBeUndefined()
      dappUser.generateRequestKey()
      expect(dappUser.request_key).toBeDefined()
      expect(dappUser.request_key.length).toEqual(32)
      expect(dappUser.request_key_expires_at).toEqual(addHours(now, 24))
    })
  })

  describe('generateAccessKey()', () => {
    it('should generate the access key only if the request key is correct', () => {
      const requestKey = dappUser.generateRequestKey()
      expect(dappUser.access_key).toBeUndefined()
      expect(dappUser.access_key_expires_at).toBeUndefined()
      dappUser.generateAccessKey(requestKey)
      expect(dappUser.access_key).toBeDefined()
      expect(dappUser.access_key.length).toEqual(32)
      expect(dappUser.access_key_expires_at).toEqual(addHours(now, 24))
    })

    it('should not work if no request is defined', () => {
      expect(() => {
        dappUser.generateAccessKey(null)
      }).toThrow()
    })

    it('should fail on invalid request key', () => {
      dappUser.generateRequestKey()
      expect(() => {
        dappUser.generateAccessKey('asdf')
      }).toThrow()
    })
  })
})
