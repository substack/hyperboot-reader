module.exports = function (p, cb) {
  p.then(function (p) { cb(null, p) })
  p.catch(cb)
}
