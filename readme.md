# Graphite UDP

Graphite UDP client for Node.js

* UDP for max performance
* Uses the plaintext Graphite protocol
* Group values for a configurable interval of time and send 1 request
* No other modules dependency


## Install
```
npm install graphite-udp
```

## Usage
```js
graphiteUdp = require('./graphite-udp').createClient([options])
graphiteUdp.addMetric(metric, value, [callback])
```

`options` is an object with the following defaults:
```
{
	host: '127.0.0.1',
	port: 2003,
	verbose: false,
	interval: 5000, // group metrics for this 5s and send 1 request
	type: 'udp4'
}
```

## Example
```js
graphiteUdp = require('./graphite-udp').createClient({verbose:true});
for (var i = 0; i < 100; i++) {
	graphiteUdp.addMetric('my.test.metric', parseInt(Math.random()*100, 10));
}
```

Make sure your Carbon is listening for UDP connections on carbon.conf

`ENABLE_UDP_LISTENER = True # default for version 0.9.10 of Graphite is False`


## License

Licensed under the MIT license.