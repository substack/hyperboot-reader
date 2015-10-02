var xtend = require('xtend')
var render = require('./lib/render.js')

var main = require('main-loop')
var loop = main(
  { url: location.pathname },
  render, require('virtual-dom')
)
var root = document.querySelector('#content')
root.replaceChild(loop.target, root.childNodes[0])

var singlePage = require('single-page')
var show = singlePage(function (href) {
  loop.update(xtend({ url: href }))
})
require('catch-links')(window, show)
