var h = require('virtual-dom/h')
var modal = require('../modal.js')

module.exports = function (m, state, emit, router) {
  var app = state.apps[m.params.id]
  var msg
  if (!app) msg = h('no such app: ' + m.params.id)
  else msg = [
    h('h3', 'Are you sure you want to delete this app?'),
    h('div', [
      h('span.app-title', app.title),
      h('span.app-id', app.id)
    ]),
    h('div.buttons', [
      h('button.confirm', 'REMOVE'),
      h('button.cancel', 'CANCEL')
    ])
  ]
  return modal({ title: 'help', message: msg }, state, emit, router)
}
