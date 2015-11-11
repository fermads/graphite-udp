# Graphite UDP

Graphite UDP client for Node.js

* UDP for maximum performance
* Uses the plaintext Graphite protocol
* Group values for a configurable interval and send 1 request
* No other modules dependency


## Install
```
npm install graphite-udp
```

## Usage
```js
var graphite = require('graphite-udp')

var metric = graphite.createClient([options])
metric.add(name, value)
metric.put(name, value)
```

`options` is an object with the following defaults:
```js
{
  host: '127.0.0.1', // graphite server host
  port: 2003, // graphite server default udp port
  type: 'udp4', // udp type (udp4 or udp6)
  prefix: '', // a prefix to prepend to the name of all matrics
  suffix: '', // a suffix to append to the name of all metrics
  verbose: false, // log messages to console
  interval: 5000, // group metrics for 5s and send only 1 request
  callback: null // callback(error, metricsSent) for when metrics are sent to server
}
```

Make sure your Carbon is listening for UDP connections on carbon.conf

`ENABLE_UDP_LISTENER = True # default for version 0.9.10 of Graphite is False`


## Example
```js
var os = require('os')
var graphite = require('graphite-udp')
var metric = graphite.createClient({
  prefix: 'myproductname',
  suffix: os.hostname(),
  interval: 60000,
  verbose: true,
  callback: function(error, metricsSent) {
    console.log('Metrics sent\n'+ metricsSent)
  }
})

metric.add('my.test.metric1', 10) // add
metric.add('my.test.metric1', 20) // add 10+20
metric.put('my.test.metric2', 1) // put
metric.put('my.test.metric2', 5) // put overwrite 1 with 5

```

Will generate
```
myproductname.my.test.metric1.NI-67936-0 30 1447193969
myproductname.my.test.metric2.NI-67936-0 5 1447193969
```

# API

### metric.add
During the `interval` time option, if 2 or more metrics with the same name
are sent, metrics will be added (summed)
```js
metrics.add('my.test.metric', 20)
metrics.add('my.test.metric', 10)
```
What will actually be sent to the server after `interval` is
```
my.test.metric 30
```

### metric.put
During the `interval` time option, if 2 or more metrics with the same name
are sent, the last one will be used
```js
metrics.put('my.test.metric', 20)
metrics.put('my.test.metric', 10)
```
What will actually be sent to the server after `interval` is
```
my.test.metric 10
```


## License

Licensed under the MIT license.