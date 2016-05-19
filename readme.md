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
// or var metric = new graphite.Client([options])
metric.add(name, value)
metric.put(name, value)
```

`options` is an object with the following defaults:

```js
{
  host: '127.0.0.1', // graphite server host or ip
  port: 2003, // graphite server udp port
  type: 'udp4', // udp type (udp4 or udp6)
  maxPacketSize: 4096, // split into smaller UDP packets (read Note 3 below)
  prefix: '', // a prefix to prepend to the name of all metrics
  suffix: '', // a suffix to append to the name of all metrics
  verbose: false, // log messages to console
  interval: 5000, // group metrics for 5s and send only 1 request
  callback: null // callback(error, metrics) called when metrics are sent
}
```

__Note 1__: UDP is connection-less protocol. Many errors (connection errors)
won't emit or throw (except DNS lookups) so make sure your `host`, `port` and
`type` are correct.

__Note 2__: Make sure your Carbon is listening for UDP connections on carbon.conf

`ENABLE_UDP_LISTENER = True # default for version 0.9.10 of Graphite is False`

__Note 3__: If you are getting packets dropped tweak with
`maxPacketSize` option and read
[UDP max packet size](https://github.com/nodejs/node-v0.x-archive/issues/1623) and "A Note about UDP datagram size" at
[Node.js dgram module doc](https://nodejs.org/api/dgram.html)


## Example
```js
var os = require('os')
var graphite = require('graphite-udp')
var metric = graphite.createClient({
  prefix: 'productname',
  suffix: os.hostname(),
  interval: 60000,
  verbose: true,
  callback: function(error, metrics) {
    console.log('Metrics sent\n'+ metrics)
  }
})

metric.add('my.test.metric1', 10) // add 10
metric.add('my.test.metric1', 20) // add 20 (previous 10 + 20 = 30)
metric.put('my.test.metric2', 1) // put 1
metric.put('my.test.metric2', 5) // put 5 (overwrite 1 with 5)
```

After 1m (`interval`) will generate:

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