var main = require('main-loop')
var render = require('./lib/render.js')
var loop = main(
  { url: location.pathname },
  render, require('virtual-dom')
)
var root = document.querySelector('#content')
root.replaceChild(loop.target, root.childNodes[0])
