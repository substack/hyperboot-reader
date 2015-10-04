var h = require('virtual-dom/h')
var layout = require('../layout.js')

module.exports = function (m, state, emit) {
  return layout(state, [
    'app settings!!!',
    m.params.id
  ])
}
