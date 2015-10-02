var h = require('virtual-dom/h')

module.exports = function (body) {
  return h('div', [
    h('div.header', [
      h('h1', 'hyperboot'),
      h('div.buttons', [
        h('button.icon', [ 'apps' ]),
        h('button.icon', [ 'search' ]),
        h('button.icon', [ 'activity' ]),
        h('button.icon', [ 'settings' ])
      ]),
    ]),
    h('div.contents', body)
  ])
}
