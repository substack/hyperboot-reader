var main = require('main-loop')
var EventEmitter = require('events').EventEmitter
var extend = require('xtend')
var deepExtend = require('deep-extend')

module.exports = function (state, render, vdom) {
  var bus = new EventEmitter
  var emit = bus.emit.bind(bus)
  var loop = main(state, renderer, vdom)
  loop.bus = bus
  loop.extend = function (obj) {
    loop.update(extend(loop.state, obj))
  }
  loop.deepExtend = function (obj) {
    loop.update(deepExtend(loop.state, obj))
  }
  return loop

  function renderer (state) { return render(state, emit) }
}
