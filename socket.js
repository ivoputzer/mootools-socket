var WebSocket = WebSocket || webkitWebSocket || mozWebSocket

var Socket = new Class({

  Implements: [Options, Events],

  options: {
    protocols: [],
    reconnect: true,
    parseJson: true,
    reconnectTimeout: 2500,
    events: {
      /*
      onOpen: function () {
        console.log('Socket -- Connected to websocket server at %s', this.url)
      },
      onClose: function (e) {
        console.log('Socket -- Disconnected from websocket server', e.reason)
      },
      onError: function (e) {
        console.log('Socket -- Websocket error')
      },
      onMessage: function (data, e) {
        console.log('Socket -- Data recieved from server: %s', e.data, e)
      },
      onUnload: function () {
        console.log('Socket -- User is being disconnected')
      }
      */
    }
  },

  initialize: function(url, options) {
    if ('null' !== typeOf(options)) this.setOptions(options)
    this.url = url
    if (this.options.reconnect)
      this.addEvent('onClose', function(){
        this.open.delay(this.options.reconnectTimeout, this)
      }.bind(this))
    this.addEvents(this.options.events)
    window.addEvent('unload',function(e){
      this.fireEvent('onUnload', e)
      this.ws.close(1001) // 1001 => The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.
    }.bind(this))
    this.open()
  },

  isOpen: function () {
    return (this.ws.readyState === this.ws.OPEN) // The connection is open and ready to communicate.
  },

  isConnecting: function () {
    return (this.ws.readyState === this.ws.CONNECTING) // The connection is not yet open.
  },

  isClosing: function () {
    return (this.ws.readyState === this.ws.CLOSING) // The connection is in the process of closing.
  },

  isClosed: function () {
    return (this.ws.readyState === this.ws.CLOSED) // The connection is closed or couldn't be opened.
  },

  getState: function () {
    return this.ws.readyState
  },

  open: function () {
    try {
      this.ws = new WebSocket(this.url, this.options.protocols)

      this.ws.onerror = function (e) {
        this.fireEvent('onError', e)
      }.bind(this)

      this.ws.onopen = function () {
        this.fireEvent('onOpen')
      }.bind(this)

      this.ws.onclose = function (e) {
        this.fireEvent('onClose', e)
      }.bind(this)

      this.ws.onmessage = function (e) {
        try {
          this.fireEvent('onMessage', [this.options.parseJson ? JSON.parse(e.data) : e.data, e])
        } catch(err) {
          console.error('Socket -- The WebSocket server sent non parsable json')
        }
      }.bind(this)
    } catch(err) {
      console.error('Socket -- %s', err.message)
    }
  },

  send: function (data) {
    try {
      try {
        if (this.options.parseJson) data = JSON.stringify(data)
      } catch(err) {
        throw 'Trying to send non parsable json to the WebSocket server'
      }
      this.ws.send(data)
    } catch(err) {
      console.error('Socket -- %s', err.message)
    }
  },

  close: function (reason) {
    try {
      this.ws.close(1000)
    } catch(err) {
      console.error('Socket -- %s', err.message)
    }
  }
})