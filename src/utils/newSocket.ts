const io = require('socket.io-client')

export function newSocket() {
  const uri = process.env.NOTUS_API_WS_URI
  console.log(`Connecting to ${uri}`)
  return io(uri)
}
