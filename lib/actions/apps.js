var hyperboot = require('hyperboot')
var EventEmitter = require('events')
var xhr = require('xhr')
var sub = require('subleveldown')
var randombytes = require('randombytes')
var through = require('through2')
var once = require('once')
var tuple = require('tuple')

module.exports = Apps

function Apps (loop, db) {
  if (!(this instanceof Apps)) return new Apps(loop, db)
  var self = this
  self.db = db
  self.loop = loop
  self.boots = {}
}

Apps.prototype.populate = function (cb) {
  var self = this
  cb = once(cb || noop)
  var s = self.db.createReadStream({ gt: 'app-id!', lt: 'app-id!~' })
  s.on('error', cb)
  s.pipe(through.obj(write, end))

  function write (row, enc, next) {
    var id = row.key.split('!')[1]
    var boot = hyperboot(sub(self.db, 'app!' + id))
    self.boots[id] = boot
    boot.versions(function (err, vers) {
      if (err) error(err)
      else vers.forEach(onversion)
    })
    boot.on('version', onversion)
    self.loop.deepExtend({ apps: tuple(id, row.value) })
    next()

    function onversion (v) {
      var update = { id: id, version: v }
      self.loop.extend({
        activity: self.loop.state.activity.concat(update)
      })
    }
  }
  function end () { cb(null) }
}

Apps.prototype.load = function (href) {
  var self = this
  var id = randombytes(8).toString('hex')
  var boot = hyperboot(sub(self.db, 'app!' + id))
  self.boots[id] = boot

  boot.once('version', function (v) {
    var app = {
      id: id,
      href: href,
      title: '...',
      icon: null,
      order: Object.keys(loop.state.apps).length
    }
    boot.get(v.hash, function (err, doc) {
      if (err) return error(err)
      var html = document.createElement('html')
      html.innerHTML = doc
      var title = html.querySelector('title')
      app.title = title ? title.textContent : 'untitled'
      var ico = html.querySelector('link[rel=icon]')
      if (ico) app.icon = ico.getAttribute('href')

      app.version = v.version
      loop.deepExtend({ apps: tuple(id, app) })

      self.db.put('app-id!' + id, app, function (err) {
        if (err) return error(err)
      })
    })
    loop.deepExtend({ apps: tuple(id, app) })
  })
  boot.on('version', function (v) {
    var update = { id: id, version: v }
    loop.extend({ activity: loop.state.activity.concat(update) })
  })
  boot.load(href, function (err, vers) {})
}

Apps.prototype.run = function (app) {
  var self = this
  if (!self.boots[app.id]) return self._error('no such id: ' + app.id)
  self.boots[app.id].get(app.version, function (err, html) {
    if (err) error(err)
    location.href = 'data:text/html,' + html
  })
}

Apps.prototype.hover = function (app) {
  this.loop.extend({
    info: {
      type: 'info',
      message: 'SHIFT+CLICK or HOLD CLICK to configure'
    }
  })
}

Apps.prototype.unhover = function (app) {
  this.loop.extend({ info: null })
}

Apps.prototype._error = function (err) {
  this.loop.extend({ error: err })
}

function noop () {}
