Mootools-Socket
=====

The `Socket` wrapper provides a unified API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.


Creating a Socket object
=====

In order to communicate using the WebSocket protocol, you need to create a WebSocket object; this will automatically attempt to open the connection to the server.

```javascript

// Class : Socket(url[,options])

var socket = new Socket('ws://localhost:8080', {
    protocols: [], // ['wamp', 'soap', 'xmpp']
    reconnect: true,
    parseJson: true,
    reconnectTimeout: 2500,
    events: {
        onOpen: function(){ /* */ },
        onClose: function(e){ /* */ },
        onError: function(e){ /* */ },
        onMessage: function(data, e){ /* */ },
        onUnload: function() { /* */ }
    }
})
````

## socket.close([DOMString reason])
Closes the connection or connection attempt, if any. If the connection is already CLOSED, this method does nothing. **reason** (optional) is a human-readable string explaining why the connection is beeing closed. This string must be no longer than 123 bytes of UTF-8 text (not characters).


## socket.send([DOMString|ArrayBuffer|Blob data])
Transmits data to the server over the WebSocket connection.