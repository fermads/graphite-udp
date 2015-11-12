var dgram = require('dgram')
var port = 2003

function start(callback) {
  var server = dgram.createSocket('udp4')

  server.on('listening', function() {
    var info = server.address()

    console.log('[mock-server] UDP server listening to',
      info.address, 'on port', info.port)

    if(callback)
      callback()
  })

  server.on('message', function(message, remote) {
    console.log('[mock-server] Metrics received from:', remote.address,
      remote.port, message.toString().replace(/^|\n/g, '\n\t'))
    server.close()
    console.log('[mock-server] Server closed')
  })

  server.bind(port)
}

module.exports = {
  start: start
}