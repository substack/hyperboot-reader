var h = require('virtual-dom/h')
var layout = require('./layout.js')
var Router = require('routes')

module.exports = function (state, emit) {
  var m = router.match(state.url)
  if (!m) return h('div.error', '404 not found')
  return m.fn(m, state, emit, router)
}

var fs = require('fs')
var bootIcon = fs.readFileSync(__dirname + '/../public/boot.svg')

var router = Router()

router.addRoute('/*/modal/help/:topic', require('./render/help.js'))
router.addRoute('/settings/app/:id/modal/remove',
  require('./render/remove_app.js'))

router.addRoute('/', require('./render/apps.js'))
router.addRoute('/load/*', require('./render/apps.js'))

router.addRoute('/settings', require('./render/settings.js'))
router.addRoute('/settings/app/:id', require('./render/app_settings.js'))

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
