var hyperboot = require('hyperboot')
var EventEmitter = require('events')
var xhr = require('xhr')
var sub = require('subleveldown')
var randombytes = require('randombytes')
var through = require('through2')

module.exports = function (loop, db) {
  loadApps(loop, db)
}

function loadApps (loop, db) {
  var boots = {}
  db.createReadStream({ gt: 'app-id!', lt: 'app-id!~' })
    .pipe(through.obj(function (row, enc, next) {
      var id = row.key.split('!')[1]
      var boot = hyperboot(sub(db, 'app!' + id))
      boots[id] = boot
      boot.versions(function (err, vers) {
        if (err) error(err)
        else vers.forEach(onversion)
      })
      boot.on('version', onversion)
      loop.extend({ installed: loop.state.installed.concat(row.value) })
      next()

      function onversion (v) {
        var update = { id: id, version: v }
        loop.extend({ activity: loop.state.installed.concat(update) })
      }
    }))

  loop.bus.on('load-app', function (href) {
    var id = randombytes(8).toString('hex')
    var boot = hyperboot(sub(db, 'app!' + id))
    boots[id] = boot

    boot.once('version', function (v) {
      var app = { id: id, href: href, title: '...', icon: null }
      boot.get(v.hash, function (err, doc) {
        if (err) return error(err)
        var html = document.createElement('html')
        html.innerHTML = doc
        var title = html.querySelector('title')
        app.title = title ? title.textContent : 'untitled'
        var ico = html.querySelector('link[rel=icon]')
        if (ico) app.icon = ico.getAttribute('href')

        app.version = v.version

        var installed = loop.state.installed
        for (var i = installed.length - 1; i >= 0; i--) {
          if (installed[i].id !== id) continue
          installed[i] = app
          break
        }
        loop.extend({ installed: installed })

        db.put('app-id!' + id, app, function (err) {
          if (err) return error(err)
        })
      })
      loop.extend({ installed: [app].concat(loop.state.installed) })
    })
    boot.on('version', function (v) {
      var update = { id: id, version: v }
      loop.extend({ activity: loop.state.installed.concat(update) })
    })
    boot.load(href, function (err, vers) {})
  })

  loop.bus.on('run-app', function (app) {
    if (!boots[app.id]) return error('no such id: ' + app.id)
    boots[app.id].get(app.version, function (err, html) {
      if (err) error(err)
      location.href = 'data:text/html;base64,' + btoa(html)
    })
  })
 
  function error (err) {
    loop.extend({ error: err })
  }
}
