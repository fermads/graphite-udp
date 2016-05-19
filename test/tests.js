var os = require('os')
var graphite = require('../graphite-udp')

var tests = [ // test all types of values
  'ok', 1, 0, -1, 1.232, -1.111, false, true, null,
  undefined, Infinity, NaN, {a: 1},
  {}, [1], [], '', function () {},
  new Date(), new RegExp(), void (0)
]

var metric

var options = {
  host: '127.0.0.1',
  prefix: 'myproductname',
  suffix: os.hostname(),
  verbose: true,
  interval: 100,
  callback: function (error, metricsSent) {
    if (error) return console.log(error)
    console.log('[tests] From callback - metrics sent:'
      + metricsSent.replace(/^|\n/g, '\n\t'))
    metric.close()
  }
}

function run () {
  metric = new graphite.Client(options)

  console.log('[tests] Starting tests...')

  for (var i = 0; i < 10; i++) {
    metric.add('my.test.metric1', parseInt(Math.random()*100, 10))
    metric.put('my.test.metric2', parseInt(Math.random()*100, 10))
  }

  metric.add('my.test.metric3', 10)
  metric.add('my.test.metric3', 20)
  metric.add('my.test.metric3', 1.23)
  metric.put('my.test.metric4', 1)
  metric.put('my.test.metric4', 5)
  metric.put('my.test.metric4', -5)

  tests.forEach(function (value) {
    metric.add('my.test.metric5', value)
  })
}

module.exports = {
  run: run
}
