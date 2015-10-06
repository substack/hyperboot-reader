var Apps = require('./actions/apps.js')
var tuple = require('tuple')

module.exports = function (loop, db) {
  var bus = loop.bus

  var apps = Apps(loop, db)
  apps.populate()
  bus.on('load-app', function (href) { apps.load(href) })
  bus.on('hover-app', function (app) { apps.hover(app) })
  bus.on('unhover-app', function (app) { apps.unhover(app) })
  bus.on('run-app', function (app) {
    apps.unhover(app)
    apps.run(app)
  })
  bus.on('configure-app', function (app) {
    bus.emit('go', '/settings/app/' + app.id)
  })
  bus.on('remove-app', function (app) {
    bus.emit('go', '/settings/app/' + app.id + '/modal/remove')
  })
  bus.on('remove-app-confirmed', function (app) {
    apps.remove(app, function (err) {
      if (!err) bus.emit('go', '/')
    })
  })
  bus.on('shift', function () {
    loop.deepExtend({ keys: { shift: true } })
  })

  bus.on('unshift', function () {
    loop.deepExtend({ keys: { shift: false } })
  })
  bus.on('set-version', function (app, v) {
    apps.setVersion(app, v)
  })

  bus.on('help', function (topic) {
    bus.emit('go', loop.state.url + '/modal/help/' + topic)
  })
  bus.on('close-modal', function () {
    bus.emit('go', loop.state.url.replace(/\/modal\/.*$/, ''))
  })
}
