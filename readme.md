# Graphite UDP

Graphite UDP client for Node.js

* UDP for maximum performance
* Uses the plaintext Graphite protocol
* Group values for a configurable interval and send 1 request
* No other module dependencies

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
  host: '127.0.0.1', // graphite server host or ip
  port: 2003, // graphite server udp port
  type: 'udp4', // udp type (udp4 or udp6)
  prefix: '', // a prefix to prepend to the name of all metrics
  suffix: '', // a suffix to append to the name of all metrics
  verbose: false, // log messages to console
  interval: 5000, // group metrics for 5s and send only 1 request
  callback: null // callback(error, metrics) called when metrics are sent
}
```

Note that UDP is connection-less protocol. Many errors (connection errors)
won't emit or throw (except DNS lookups) so make sure your `host`, `port` and
`type` are correct.

Also make sure your Carbon is listening for UDP connections on carbon.conf

`ENABLE_UDP_LISTENER = True # default for version 0.9.10 of Graphite is False`

## Example
```js
var os = require('os')
var graphite = require('graphite-udp')
var metric = graphite.createClient({
  prefix: 'productname',
  suffix: os.hostname(),
  interval: 60000,
  verbose: true,
  callback: function(error, metricsSent) {
    console.log('Metrics sent\n'+ metricsSent)
  }
})

metric.add('my.test.metric1', 10) // add 10
metric.add('my.test.metric1', 20) // add 20 (previous 10 + 20 = 30)
metric.put('my.test.metric2', 1) // put 1
metric.put('my.test.metric2', 5) // put 5 (overwrite 1 with 5)
```

Will generate

```
productname.my.test.metric1.machinename 30 1447193969
productname.my.test.metric2.machinename 5 1447193969
```

# API

### metric.add
During the `interval` time option, if 2 or more metrics with the same name
are sent, metrics will be added (summed)

```js
metric.add('my.test.metric', 20)
metric.add('my.test.metric', 10)
```
What will actually be sent to the server after `interval` is

```
my.test.metric 30
```

### metric.put
During the `interval` time option, if 2 or more metrics with the same name
are sent, the last one will be used

```js
metric.put('my.test.metric', 20)
metric.put('my.test.metric', 10)
```
What will actually be sent to the server after `interval` is

```
my.test.metric 10
```

### metric.close
Close the underlying UDP client socket

```js
metric.close()
```

## License

Licensed under the MIT license.