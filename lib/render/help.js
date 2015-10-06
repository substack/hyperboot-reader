var h = require('virtual-dom/h')
var modal = require('../modal.js')

module.exports = function (m, state, emit, router) {
  var msg
  if (m.params.topic === 'versions') {
    msg = 'version help goes here...'
  }
  else msg = 'help topic not found: ' + m.params.topic
  return modal({ title: 'help', message: msg }, state, emit, router)
}
