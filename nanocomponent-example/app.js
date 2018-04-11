var choo = require('choo')
var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

class Button extends Nanocomponent {
  constructor () {
    super()
    this.button = null
  }

  createElement (button) {
    // important we use a copy because if we change state
    // later we don't want that to effect this directly
    this.button = Object.assign({}, button);
    return html`
      <button style="background-color: ${button.backgroundColor}; color: ${button.color}">
        Click Me
      </button>
    `
  }

  update (newButton) {
    return newButton.backgroundColor !== this.button.backgroundColor
  }
}

class ButtonManager extends Nanocomponent {
  constructor () {
    super()
    this.buttons = null
  }

  createElement (buttons) {
    this.buttons = buttons.map((button) => new Button)
    return html`<div>${this.buttons.map((button,idx) => button.render(buttons[idx]))}</div>`
  }

  update (newButtons) {
    newButtons.forEach((newButton,idx) => {
      this.buttons[idx].render(newButton)
    })
    return false;
  }
}

var bm = new ButtonManager;
var app = choo()
app.route('/', mainView)
app.mount('body')


var mr = require('mrcolor');
const invert = require('invert-color');

var getColor = mr();
const getRandomColor = function() {
  var color = getColor().rgb();

  var foregroundColor= invert(color)
  var backgroundColor = `rgb(${color.join(',')})`;
  return {foregroundColor, backgroundColor}
}

app.use((state, emitter) => {
  state.buttons = [];
  for (var i = 0; i < 5; i++) {
    let colorObj = getRandomColor();
    state.buttons.push({color:colorObj.foregroundColor, backgroundColor:colorObj.backgroundColor})
  }
  setInterval(() => {
    const index = ~~(Math.random()*state.buttons.length)
    const colorObj = getRandomColor();
    state.buttons[index].color = colorObj.foregroundColor;
    state.buttons[index].backgroundColor = colorObj.backgroundColor;
    emitter.emit('render');
  }, 500)
})
function mainView (state, emit) {
  return html`<body>
  ${bm.render(state.buttons)}
  </body>`
}
