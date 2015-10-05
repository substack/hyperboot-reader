var xtend = require('xtend')
var level = require('level-browserify')
var defaults = require('levelup-defaults')
var db = defaults(level('hyperboot'), { valueEncoding: 'json' })

var render = require('./lib/render.js')
var busloop = require('./lib/bus_loop.js')
//var worker = require('./lib/worker.js')

//worker('/worker.js', function (err) {
//  console.log(err)
//})

var loop = busloop({
  url: location.pathname + (location.search || '') + (location.hash || ''),
  apps: {},
  activity: [],
  info: null,
  keys: {}
}, render, require('virtual-dom'))
require('./lib/events.js')(loop, db)

var root = document.querySelector('#content')
root.replaceChild(loop.target, root.childNodes[0])

var singlePage = require('single-page')
var show = singlePage(function (href) {
  loop.extend({ url: href })
})
require('catch-links')(window, show)
loop.bus.on('go', show)

window.addEventListener('keydown', onkey)
window.addEventListener('keyup', onkey)
window.addEventListener('mousemove', onkey)

function onkey (ev) {
  if (loop.state.keys.shift !== ev.shiftKey) {
    loop.bus.emit(ev.shiftKey ? 'shift' : 'unshift')
  }
}
