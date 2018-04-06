# choo examples!

## Input
This first one is an adapation from [here](http://requirebin.com/?gist=e589473373b3100a6ace29f7bbee3186) when there was
`app.model`.

```javascript
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.use(titleStore)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
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
```


## 
