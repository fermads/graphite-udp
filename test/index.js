var server = require('./mock-server')
var tests = require('./tests')

server.start(tests.run)
