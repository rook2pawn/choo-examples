var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.use(titleStore)
app.route('/', titleView)
app.mount('body')

function titleView (state, emit) {
  return html`
    <body>
    <h1>${state.title}</h1>
    <input
      type="text"
      value="${state.title}"
      oninput=${oninput} />
    </body>
  `

  function oninput (e) {
    emit('update', e.target.value)
  }
}

function titleStore (state, emitter) {
  state.title = "Set the title"
  emitter.on('update', function (title) {
    state.title = title;
    emitter.emit('render')
  })
}
