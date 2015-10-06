var h = require('virtual-dom/h')

module.exports = function (opts, state, emit, router) {
  var u = state.url.replace(/\/modal\/.*$/, '')
  var m = router.match(u)
  return h('div.modal', [
    h('div.box', [
      h('div.title', [
        opts.title || '',
        h('button.close', { onclick: close }, 'close')
      ]),
      h('div.message', opts.message)
    ]),
    h('div.screen'),
    h('div.inner',
      m ? m.fn(m, state, emit) : h('div', '404 not found')
    )
  ])
  function close () { emit('close-modal') }
}
