var h = require('virtual-dom/h')
var layout = require('../layout.js')

module.exports = function (m, state, emit) {
  return layout(state, [
    'settings go here'
  ])
}
