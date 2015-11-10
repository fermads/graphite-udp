var dgram = require('dgram')

var port = 2003
var server = dgram.createSocket('udp4')

server.on('listening', function() {
  var info = server.address()
  console.log('UDP server listening to', info.address, 'on port', info.port)
})

server.on('message', function(message, remote) {
  console.log('Metrics received from:', remote.address,
    remote.port, '\n'+ message.toString())
})

server.bind(port)