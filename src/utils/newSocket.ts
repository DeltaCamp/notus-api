const io = require('socket.io-client')

export function newSocket() {
  const uri = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`.replace('http', 'ws')
  return io(uri)
}
