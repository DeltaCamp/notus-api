import * as crypto from 'crypto'

export function sha256(input: string): Buffer {
  const hash = crypto.createHash('sha256')
  hash.update(input)
  return hash.digest()
}
