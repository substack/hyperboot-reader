var h = require('virtual-dom/h')
var layout = require('./layout.js')
var Router = require('routes')
var xtend = require('xtend')

module.exports = function (state) {
  var m = router.match(state.url)
  if (!m) return h('div.error', '404 not found')
  return m.fn(xtend(m, { state: state }))
}

var router = Router()
router.addRoute('/', function (m) {
  return layout([
    'icon list goes here'
  ])
})

router.addRoute('/activity', function (m) {
  return layout([
    'activity feed goes here'
  ])
})

router.addRoute('/search', function (m) {
  return layout([
    'search feed goes here'
  ])
})

router.addRoute('/settings', function (m) {
  return layout([
    'settings go here'
  ])
})
