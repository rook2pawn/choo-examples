const choo = require('choo')
const html = require('choo/html')

const getRandomColor = require("./getRandomColor")
const ButtonManager = require("./buttonManager")

var bm = new ButtonManager;
var app = choo()

function mainView (state, emit) {
  return html`<div id='main'>
  ${bm.render(state.buttons)}
  </div>`
}


app.use((state, emitter) => {
  state.buttons = Array(5).fill().map(() => getRandomColor());
  setInterval(() => {
    const index = ~~(Math.random()*state.buttons.length)
    const colorObj = getRandomColor();
    state.buttons[index].color = colorObj.color;
    state.buttons[index].backgroundColor = colorObj.backgroundColor;
    emitter.emit('render');
  }, 500)
})
app.route(baseRoute(), mainView)
app.mount('div#nestedbuttonsexample')

function baseRoute() {
  var isLocal = (window.location.origin == "file://")
  if (isLocal)
    return "/"
  else
    return "/choo-examples"
}
