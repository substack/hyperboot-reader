var h = require('virtual-dom/h')
var layout = require('./layout.js')
var Router = require('routes')

module.exports = function (state, emit) {
  var mm = modalRouter.match(state.url)
  var u = mm ? state.url.replace(/\/help\/[^\/]*$/, '') : state.url
  var mr = router.match(u)
  if (!mr) return h('div.error', '404 not found')
  var content = mr.fn(mr, state, emit)
  if (mm) return mm.fn(content, mm, state, emit)
  return content
}

var fs = require('fs')
var bootIcon = fs.readFileSync(__dirname + '/../public/boot.svg')

var router = Router()
var modalRouter = Router()
modalRouter.addRoute('/*/help/:topic', require('./render/help.js'))

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
