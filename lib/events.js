var Apps = require('./actions/apps.js')

module.exports = function (loop, db) {
  var apps = Apps(loop, db)
  apps.populate()
  loop.bus.on('load-app', function (href) { apps.load(href) })
  loop.bus.on('run-app', function (app) { apps.run(app) })
}
