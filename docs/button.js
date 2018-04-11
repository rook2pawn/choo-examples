const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Button extends Nanocomponent {
  constructor () {
    super()
    this.button = null
  }

  createElement (button) {
    // important we use a copy because if we change state
    // later we don't want that to effect this directly
    this.button = Object.assign({}, button)
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

module.exports = exports = Button
