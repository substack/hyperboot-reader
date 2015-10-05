var h = require('virtual-dom/h')
var layout = require('../layout.js')
var util = require('util')

module.exports = function (m, state, emit) {
  var app = state.apps[m.params.id]
  if (!app) return layout(state, [ 'app not found' ])

  return layout(state, [
    h('div.toolbar', [ 'application settings' ]),
    h('div.app-settings', [
      h('div.icon', [
        h('img', { src: app.icon }),
      ]),
      h('div.right', [
        h('h2', [ app.title ]),
        h('div', [ app.href ]),
        h('form', [
          h('input', { type: 'text', placeholder: 'location url' }),
          h('button', { type: 'submit' }, 'add')
        ])
      ]),
      h('div.versions-box', [
        h('h3', 'versions'),
        '...'
      ])
    ])
  ])
}
