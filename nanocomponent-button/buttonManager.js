const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

const Button = require('./button')

class ButtonManager extends Nanocomponent {
  constructor () {
    super()
    this.buttons = null
  }

  createElement (buttons) {
    // this is done *once* because we have return false on update
    this.buttons = buttons.map((button) => new Button)
    return html`<div>${this.buttons.map((button,idx) => button.render(buttons[idx]))}</div>`
  }

  update (newButtons) {
    // render children
    newButtons.forEach((newButton,idx) => {
      this.buttons[idx].render(newButton)
    })
    return false;
  }
}

module.exports = exports = ButtonManager
