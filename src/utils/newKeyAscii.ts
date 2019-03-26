const crypto = require('crypto')

export function newKeyAscii(): string {
  return crypto.randomBytes(32).toString('ascii');
}
