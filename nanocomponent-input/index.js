var html = require('choo/html')
var choo = require('choo')
const Nanocomponent = require('nanocomponent')

class TitleComponent extends Nanocomponent {
  constructor () {
    super()
    this.title = null
  }

  createElement (title) {
    // if this were an object we would want to assign a copy, not use the reference
    // otherwise our update function would always return false. 
    this.title = title;
    return html`<h1>${title}</h1>`
  }

  update (title) {
    return title !== this.title
  }
}
var app = choo()
app.use(titleStore)
app.route('/', mainView)
app.mount('body')

var title = new TitleComponent;
function mainView (state, emit) {
  return html`
    <body>
    <h1>${title.render(state.title)}</h1>
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
