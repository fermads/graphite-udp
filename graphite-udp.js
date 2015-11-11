var dgram = require('dgram')
var util = require('util')

function Client(options) {

  var queue = {}, socket

  var defaults = {
    host: '127.0.0.1',
    port: 2003,
    type: 'udp4',
    prefix: '',
    suffix: '',
    verbose: false,
    interval: 5000,
    callback: null
  }

  function init() {
    options = util._extend(defaults, options)

    connect()

    setInterval(send, options.interval)

    return {
      add: add,
      put: put,
      options: options
    }
  }

  function connect() {
    socket = dgram.createSocket(options.type)

    socket.on('close', function() {
      log('UDP socket closed')
    })

    socket.on('error', function(err) {
      log('UDP socket error: '+ err)
    })

    log('Creating new Graphite UDP client')
  }

  function put(name, value) {
    add(name, value, true)
  }

  function add(name, value, replace) {
    if(!name || isNaN(value))
      return log('Skipping invalid name/value: '+ name +' '+ value)

    if(options.prefix)
      name = options.prefix +'.'+ name

    if(options.suffix)
      name = name +'.'+ options.suffix

    if(queue[name] === undefined || replace)
      queue[name] = { value: value }
    else
      queue[name].value += value

    queue[name].timestamp = String(Date.now()).substr(0, 10)

    log('Adding metric to queue: '+ name +' '+ value)
  }

  function getQueue() {
    var text = ''

    for(var name in queue) {
      text += name +' '+ queue[name].value +' '+ queue[name].timestamp +'\n'
    }

    return text
  }

  function send() {
    if(Object.keys(queue).length === 0)
      return //log('Queue is empty. Nothing to send')

    var metrics = new Buffer(getQueue())

    log('Sending '+ Object.keys(queue).length +' metrics to '
      + options.host +':'+ options.port)

    console.log(options.hos)t;
    socket.send(metrics, 0, metrics.length, options.port, options.host,
      function(err) {
        console.log(err);
      if(err)
        return log('Error sending metrics: '+ err)

      if(options.callback)
        options.callback(err, metrics.toString())

      log('Metrics sent:\n'+ metrics.toString())
    })

    queue = {}
  }

  function log(line) {
    if(options.verbose)
      console.log('[graphite-udp]', line)
  }

  return init()
}

module.exports = {
  createClient: function(options) {
    return new Client(options)
  }
}