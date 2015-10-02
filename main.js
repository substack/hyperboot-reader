var xtend = require('xtend')
var fs = require('fs')
var render = require('./lib/render.js')

var icons = {
  hyperpaint: fs.readFileSync('public/hyperpaint.svg', 'base64')
}

var main = require('main-loop')
var loop = main({
  url: location.pathname,
  installed: [
    { title: 'hyperpaint', icon: icons.hyperpaint }
  ]
}, render, require('virtual-dom'))
var root = document.querySelector('#content')
root.replaceChild(loop.target, root.childNodes[0])

var singlePage = require('single-page')
var show = singlePage(function (href) {
  loop.update(xtend(loop.state, { url: href }))
})
require('catch-links')(window, show)
