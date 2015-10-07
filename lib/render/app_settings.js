var h = require('virtual-dom/h')
var layout = require('../layout.js')
var semver = require('semver')

module.exports = function (m, state, emit) {
  var app = state.apps[m.params.id]
  if (!app) return layout(state, [ 'app not found' ])
  var versions = Object.keys(app.versions || {})
    .sort(semver.compare)
    .map(function (v) { return app.versions[v] })
    .concat({ version: 'latest' })
    .reverse()

  return layout(state, [
    h('div.toolbar', [ 'application settings' ]),
    h('div.app-settings', [
      h('div.left', [
        h('div.icon', [
          h('img', { src: app.icon }),
        ]),
        h('div', h('button.run', { onclick: runApp }, 'run')),
        h('div', h('button.remove', { onclick: removeApp }, 'remove'))
      ]),
      h('div.right', [
        h('h2', [ app.title ]),
        h('div.locations', app.hrefs),
        h('form', [
          h('input', { type: 'text', placeholder: 'location url' }),
          h('button', { type: 'submit' }, 'add')
        ]),
        h('div', h('button.check',
          { onclick: checkUpdates },
          'check for updates'
        )),
        h('div.share', [
          h('div', 'share this app'),
          h('input', {
            type: 'text',
            value: location.protocol + '//' + location.host
              + '/install/' + btoa(JSON.stringify(app.hrefs)),
            onclick: shareSelect
          })
        ])
      ]),
      h('div.versions', [
        h('h3', [
          'versions',
          h('button.help', {
            onclick: function (ev) { emit('help', 'versions') }
          }, '?')
        ]),
        h('div', versions.map(function (ver) {
          var v = ver.version
          var bclass = app.version === v ? '.active' : ''
          return h('div', [
            h('button.version' + bclass, { onclick: setv(v) }, v)
          ])
        }))
      ])
    ])
  ])

  function setv (v) {
    return function (ev) { emit('set-version', app, v) }
  }
  function runApp () { emit('run-app', app) }
  function removeApp () { emit('remove-app', app) }
  function checkUpdates () { emit('check-updates', app) }
  function shareSelect (ev) { this.select() }
}
