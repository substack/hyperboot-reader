var h = require('virtual-dom/h')
var layout = require('./layout.js')
var Router = require('routes')
var xtend = require('xtend')
var qs = require('querystring')

module.exports = function (state, emit) {
  var m = router.match(state.url)
  if (!m) return h('div.error', '404 not found')
  return m.fn(m, state, emit)
}

var fs = require('fs')
var bootIcon = fs.readFileSync(__dirname + '/../public/boot.svg')

var router = Router()
router.addRoute('/', home)
router.addRoute('/add/*', home)

function home (m, state, emit) {
  var shift = state.keys.shift ? '.shift' : ''
  return layout(state, [
    h('div.toolbar' + shift, [
      h('form', { onsubmit: loadApp }, [
        h('input', {
          name: 'url',
          type: 'text',
          value: normURL(m.splats[0]),
          placeholder: 'webapp url: http, magnet, ipfs'
        }),
        h('button' + (m.splats[0] ? '.clickme' : ''), {
          title: 'add an application',
          type: 'submit'
        }, [ '+ app' ])
      ]),
      h('div.info', [ state.info ? state.info.message : '' ])
    ]),
    h('div.icons' + shift, state.installed.map(function (app) {
      return h('div.icon', {
        onclick: runApp,
        onmouseover: mouseOver,
        onmouseout: mouseOut
      }, [
        h('img', {
          src: app.icon || ('data:image/svg+xml,' + bootIcon),
          onerror: defaultImg
        }),
        h('div', app.title)
      ])
      function runApp (ev) { emit('run-app', app) }
      function mouseOver (ev) { emit('hover-app', app) }
      function mouseOut (ev) { emit('unhover-app', app) }
    }))
  ])
  function defaultImg () {
    this.src = 'data:image/svg+xml,' + bootIcon
  }
  function loadApp (ev) {
    ev.preventDefault()
    emit('load-app', this.elements.url.value)
  }
}

router.addRoute('/activity', function (m, state, emit) {
  return layout(state, [
    'activity feed goes here'
  ])
})

router.addRoute('/search', function (m, state, emit) {
  return layout(state, [
    'search feed goes here'
  ])
})

router.addRoute('/settings', function (m, state, emit) {
  return layout(state, [
    'settings go here'
  ])
})

function normURL (href) {
  if (!href) return undefined
  return /^[\w-]+:/.test(href) ? href : 'http://' + href
}
