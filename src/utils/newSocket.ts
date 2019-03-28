const io = require('socket.io-client')

export function newSocket() {
  const uri = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.API_PORT}`.replace('http', 'ws')
  console.log(`Connecting to ${uri}`)
  return io(uri)
}
