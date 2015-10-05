var h = require('virtual-dom/h')
var modal = require('../modal.js')

module.exports = function (body, m, state, emit) {
  if (m.params.topic === 'versions') {
    return show('help: versions', [
      'version help!!'
    ])
  }
  return show('help', 'help topic not found: ' + m.params.topic)
  function show (topic, msg) { return modal(topic, body, msg, emit) }
}
