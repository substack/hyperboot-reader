var h = require('virtual-dom/h')
var links = [
  { href: '/', title: 'apps' },
  { href: '/search', title: 'search' },
  { href: '/activity', title: 'activity' },
  { href: '/settings', title: 'settings' }
]

module.exports = function (state, body) {
  return h('div', [
    h('div.header', [
      h('h1.title', 'hyperboot'),
      h('div.buttons', links.map(function (link) {
        var bclass = link.href === state.url ? '.active' : ''
        return h('a', { href: link.href },
          h('button' + bclass, link.title))
      }))
    ]),
    h('div.content', body)
  ])
}
