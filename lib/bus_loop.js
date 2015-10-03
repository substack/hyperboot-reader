var main = require('main-loop')
var EventEmitter = require('events').EventEmitter
var xtend = require('xtend')

module.exports = function (state, render, vdom) {
  var bus = new EventEmitter
  var emit = bus.emit.bind(bus)
  var loop = main(state, renderer, vdom)
  loop.bus = bus
  loop.extend = function (obj) {
    loop.update(xtend(loop.state, obj))
  }
  return loop
  function renderer (state) {
    return render(state, emit)
  }
}
