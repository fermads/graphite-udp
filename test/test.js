var os = require('os')
var graphite = require('../graphite-udp')

var options = {
  host: '10.0.0.222',
  prefix: 'myproductname',
  suffix: os.hostname(),
  verbose: true,
  interval: 5000,
  callback: function(error, metricsSent) {
    console.log('SENT\n'+ metricsSent)
  }
}

var metric = graphite.createClient(options)

/*for (var i = 0; i < 100; i++) {
  metric.add('my.test.metric1', parseInt(Math.random()*100, 10))
  metric.put('my.test.metric2', parseInt(Math.random()*100, 10))
}*/

metric.add('my.test.metric1', 10)
metric.add('my.test.metric1', 20)
metric.put('my.test.metric2', 1)
metric.put('my.test.metric2', 5)
metric.put('my.test.metric2', -5)
metric.put('my.test.metric2', 'sdfsdf')