const crypto = require('crypto');

export const resolveProtocolHostAndPort = () => {
  let protocolHostAndPort = `${process.env.PROTOCOL}://${process.env.HOST}`

  if (process.env.API_PORT) {
    protocolHostAndPort += `:${process.env.API_PORT}`
  }

  return protocolHostAndPort
}
