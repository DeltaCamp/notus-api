const crypto = require('crypto')

export function newKeyHex(): string {
  return crypto.randomBytes(32).toString('hex');
}
