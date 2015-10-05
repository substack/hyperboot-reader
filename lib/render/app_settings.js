var h = require('virtual-dom/h')
var layout = require('../layout.js')
var semver = require('semver')

module.exports = function (m, state, emit) {
  var app = state.apps[m.params.id]
  if (!app) return layout(state, [ 'app not found' ])
  var versions = Object.keys(app.versions || {})
    .sort(semver.compare)
    .reverse()
    .map(function (v) { return app.versions[v] })

  return layout(state, [
    h('div.toolbar', [ 'application settings' ]),
    h('div.app-settings', [
      h('div.icon', [
        h('img', { src: app.icon }),
      ]),
      h('div.right', [
        h('h2', [ app.title ]),
        h('div.locations', [ app.href ]),
        h('form', [
          h('input', { type: 'text', placeholder: 'location url' }),
          h('button', { type: 'submit' }, 'add')
        ])
      ]),
      h('div.versions', [
        h('h3', 'versions'),
        h('div', h('button.version'
          + (app.version === 'latest' ? '.active' : ''),
          { onclick: setv('latest') },
          'latest'
        )),
        h('div', versions.map(function (v) {
          var bclass = app.version === v.version ? '.active' : ''
          return h('div', h('button.version' + bclass, {
            onclick: setv(v.version)
          }, v.version))
        }))
      ])
    ])
  ])

  function setv (v) {
    return function (ev) {
      emit('set-version', app, v)
    }
  }
}
