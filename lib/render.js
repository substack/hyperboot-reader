var h = require('virtual-dom/h')
var layout = require('./layout.js')
var Router = require('routes')
var xtend = require('xtend')

module.exports = function (state) {
  var m = router.match(state.url)
  if (!m) return h('div.error', '404 not found')
  return m.fn(state, m)
}

var router = Router()
router.addRoute('/', function (state, m) {
  return layout(state, [
    'icon list goes here'
  ])
})

router.addRoute('/activity', function (state, m) {
  return layout(state, [
    'activity feed goes here'
  ])
})

router.addRoute('/search', function (state, m) {
  return layout(state, [
    'search feed goes here'
  ])
})

router.addRoute('/settings', function (state, m) {
  return layout(state, [
    'settings go here'
  ])
})
