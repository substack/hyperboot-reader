var h = require('virtual-dom/h')
var layout = require('../layout.js')

var fs = require('fs')
var bootIcon = fs.readFileSync(__dirname + '/../../public/boot.svg')

module.exports = function (m, state, emit) {
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
      h('div.info', [ state.info ? state.info.message : '...' ])
    ]),
    h('div.icons' + shift, state.installed.map(function (app) {
      return h('div.icon', {
        onclick: onclick,
        onmouseover: mouseOver,
        onmouseout: mouseOut
      }, [
        h('img', {
          src: app.icon || ('data:image/svg+xml,' + bootIcon),
          onerror: defaultImg
        }),
        h('div', app.title)
      ])
      function onclick (ev) {
        if (state.keys.shift) emit('configure-app', app)
        else emit('run-app', app)
      }
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

function normURL (href) {
  if (!href) return undefined
  return /^[\w-]+:/.test(href) ? href : 'http://' + href
}
