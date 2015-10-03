var h = require('virtual-dom/h')
var layout = require('./layout.js')
var Router = require('routes')
var xtend = require('xtend')

module.exports = function (state, emit) {
  var m = router.match(state.url)
  if (!m) return h('div.error', '404 not found')
  return m.fn(m, state, emit)
}

var fs = require('fs')
var bootIcon = fs.readFileSync(__dirname + '/../public/boot.svg', 'base64')

var router = Router()
router.addRoute('/', function (m, state, emit) {
  return layout(state, [
    h('div.toolbar', [
      h('form', { onsubmit: loadApp }, [
        h('input', {
          name: 'url',
          type: 'text',
          placeholder: 'webapp url: http, magnet, ipfs'
        }),
        h('button', {
          title: 'add an application',
          type: 'submit'
        }, [ '+ app' ]),
      ])
    ]),
    h('div.icons', state.installed.map(function (app) {
      return h('div.icon', [
        h('img', {
          src: app.icon || ('data:image/svg+xml;base64,' + bootIcon),
          onerror: defaultImg
        }),
        h('div', app.title)
      ])
    }))
  ])
  function defaultImg () {
    this.src = 'data:image/svg+xml;base64,' + bootIcon
  }
  function loadApp (ev) {
    ev.preventDefault()
    emit('load-app', this.elements.url.value)
  }
})

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
