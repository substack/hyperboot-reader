var hload = require('hyperboot/lib/load/http.js')
var concat = require('concat-stream')
var WebTorrent = require('webtorrent')
var magnet = require('magnet-uri')

module.exports = function () {
  var client = new WebTorrent

  return function (href, opts, cb) {
    if (/^https?:/.test(href)) return hload(href, opts, cb)
    if (/^magnet:/.test(href)) {
      client.add(href, function (torrent) {
        var r = torrent.files[0].createReadStream()
        r.once('error', cb)
        r.pipe(concat(function (body) {
          cb(null, body)
        }))
      })
    }
  }
}
