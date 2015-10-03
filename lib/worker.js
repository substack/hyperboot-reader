var errback = require('./errback.js')

module.exports = function (src, cb) {
  errback(navigator.serviceWorker.register(src, { scope: '/' }), onready)
  function onready (err, reg) {
    if (err) return cb(err)
    var worker = reg.installing || reg.waiting || reg.active
    worker.addEventListener('statechange', function (e) {
      console.log('STATE', e.target.state)
    })
  }
}
