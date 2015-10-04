var Apps = require('./actions/apps.js')

module.exports = function (loop, db) {
  var apps = Apps(loop, db)
  apps.populate()
  loop.bus.on('load-app', function (href) { apps.load(href) })
  loop.bus.on('hover-app', function (app) { apps.hover(app) })
  loop.bus.on('unhover-app', function (app) { apps.unhover(app) })
  loop.bus.on('run-app', function (app) {
    apps.unhover(app)
    apps.run(app)
  })
  loop.bus.on('configure-app', function (app) {
    loop.bus.emit('go', '/settings/app/' + app.id)
  })
}
