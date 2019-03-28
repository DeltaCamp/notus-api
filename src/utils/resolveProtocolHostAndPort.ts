const crypto = require('crypto');

export const resolveProtocolHostAndPort = () => {
  let protocolHostAndPort = `${process.env.PROTOCOL}://${process.env.HOST}`

  if (process.env.PORT) {
    protocolHostAndPort += `:${process.env.PORT}`
  }

  return protocolHostAndPort
}
