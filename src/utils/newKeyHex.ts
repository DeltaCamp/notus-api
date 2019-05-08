const crypto = require('crypto')

export function newKeyHex(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
