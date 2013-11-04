var dgram = require('dgram')
var util = require('util')

function Client(options) {

	var queue = {}, tid = 0, socket

	var defaults = {
		host: '127.0.0.1',
		port: 2003,
		debug: false,
		interval: 5000,
		type: 'udp4'
	}

	function init() {
		options = util._extend(defaults, options)
		socket = dgram.createSocket(options.type)

		socket.on('close', function () {
			log('UDP socket closed')
		})

		socket.on('error', function(err) {
			log('UDP socket error: '+ err)
		})

		log('Creating new Graphite UDP client')

		return {
			addMetric: addMetric,
			options: options
		}
	}

	function addMetric(name, value, callback) {
		var timestamp = String(Date.now()).substr(0, 10)

		if(queue[name] === undefined) {
			queue[name] = { value: value }
		}
		else {
			queue[name].value += value
		}

		queue[name].timestamp = timestamp

		log('Adding metric to queue: '+ name +' '+ value)

		if(tid === 0) {
			tid = setTimeout(function() {
				send(callback)
			}, options.interval)
		}
	}

	function getQueueAsPlainText() {
		var text = ''
		for(var name in queue) {
			text += name +' '+ queue[name].value +' '+ queue[name].timestamp +'\n'
		}
		return text
	}

	function send(callback) {
		if(Object.keys(queue).length === 0) {
			log('Queue is empty. Nothing to send')
			return
		}

		var metrics = new Buffer(getQueueAsPlainText())

		log('Sending '+ Object.keys(queue).length +' metrics to '+ options.host +':'+ options.port)

		socket.send(metrics, 0, metrics.length, options.port, options.host, function(err, bytes) {
			callback(err, bytes)
			if(err) {
				log('Error sending metrics: '+ err)
			}
		})

		queue = {}
		tid = 0
	}

	function log(line) {
		if(options.debug) {
			console.log(line)
		}
	}

	return init()
}

module.exports = {
	createClient: function(options) {
		return new Client(options)
	}
}