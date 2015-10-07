var h = require('virtual-dom/h')
var layout = require('../layout.js')

var fs = require('fs')
var bootIcon = fs.readFileSync(__dirname + '/../../public/boot.svg')

module.exports = function (m, state, emit) {
  var shift = state.keys.shift ? '.shift' : ''
  var apps = Object.keys(state.apps).map(function (key) {
    return state.apps[key]
  })
  var timeouts = []
  var hrefs = normURL(m.splats[0])

  return layout(state, [
    h('div.toolbar' + shift, [
      h('form', { onsubmit: loadApp }, [
        h('input', {
          name: 'url',
          type: 'text',
          value: hrefs ? hrefs[0] : undefined,
          placeholder: 'webapp url: http, magnet, ipfs'
        }),
        h('button' + (hrefs ? '.clickme' : ''), {
          title: 'add an application',
          type: 'submit'
        }, [ '+ app' ])
      ]),
      h('div.info', [ state.info ? state.info.message : '...' ])
    ]),
    h('div.icons.noselect' + shift, apps.sort(appCmp).map(function (app) {
      return h('div.icon', {
        onclick: onclick,
        onmousedown: mouseDown,
        onmouseup: mouseUp,
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
      function mouseDown (ev) {
        if (timeouts.length === 0) {
          timeouts.push(setTimeout(function () {
            emit('shift')
          }, 1000))
          timeouts.push(setTimeout(function () {
            emit('configure-app', app)
          }, 1500))
        }
      }
      function mouseUp () {
        timeouts.splice(0).forEach(clearTimeout)
        process.nextTick(function () {
          emit('unshift')
        })
      }
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

function normURL (b) {
  if (!b) return undefined
  try { var hrefs = JSON.parse(atob(b)) }
  catch (err) { return undefined }
  return hrefs.filter(function (href) {
    return /^[\w-]+:/.test(href) ? href : 'http://' + href
  })
}

function appCmp (a, b) {
  return a.order < b.order ? -1 : 1
}
