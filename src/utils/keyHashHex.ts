import { sha256 } from '../utils/sha256'

export function keyHashHex(key) {
  return sha256(key).toString('hex')
}
