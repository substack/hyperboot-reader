var h = require('virtual-dom/h')

module.exports = function (title, inner, box, emit) {
  return h('div.modal', [
    h('div.box', [
      h('div.title', [
        title,
        h('button.close', { onclick: close }, 'close')
      ]),
      h('div.message', box)
    ]),
    h('div.screen'),
    h('div.inner', inner)
  ])
  function close () { emit('close-help') }
}
