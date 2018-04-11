# choo examples

What I love about `choo` is how simple it is.

## Table of contents
1. [Choo in sixty seconds](#choo-in-sixty-seconds)
2. [Nanocomponent in sixty seconds](#nanocomponent-in-sixty-seconds)
3. Introductory examples
   - [Input](#input-example)
   - [Nested Submit Confirm](#nested-submit-confirm)
4. Nanocomponent Advanced examples
   - [Nested Buttons Example](#nested-buttons-example)

## choo in sixty seconds

There are two types of functions you supply to `.use((state,emitter) => { ... })`

1. **store** functions: they modify state, then emit `render`. When `render` happens, it will render the app, and whatever views make up your app will render the state they get. Also you set up your emitter to handle other events.

2. **view** functions: they take in state, they don't modify state at all, and return `html` based on the state it was given.

In general, you want to **pair view function with a store function**, and together, they form a "component".
```javascript
  // this is a complete choo app
    var html = require('choo/html')
    var choo = require('choo')
    var app = choo()
    app.use(titleStore)
    app.route('/',titleView)
    app.mount('body')
    function titleStore (state, emitter) {
      state.title = "Set the title"
      emitter.on('update', function (title) {
        state.title = title;
        emitter.emit('render')
      })
    }
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
```


## nanocomponent in sixty seconds

Here's the exact same example, in nanocomponent.

```javascript
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

function titleStore (state, emitter) {
  state.title = "Set the title"
  emitter.on('update', function (title) {
    state.title = title;
    emitter.emit('render')
  })
}
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
```
Notice we have renamed our `titleView` function to `mainView` to indicate that it is wrapping one or more `nanocomponents` via the `.render` function.

**What happens when `.render` is called?**
the `.update` function is called. If it returns `true` then `.createElement` is called, then it is dom-diffed and updated in the browser. If `.update` returns false, nothing more happens. When creating `nanocomponents` ensure the state you pass to `.render` is just the slice of state it needs to know about.

```javascript
  class NavBar extends Nanocomponent {
    ...
  }
  var nav = new NavBar;
  function navView (state,emitter) {
    return html`${nav.render(state.navBar)}`
  }

```

## Input Example
This first one is an adapation from [here](http://requirebin.com/?gist=e589473373b3100a6ace29f7bbee3186).

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


## Nested Submit Confirm

The new Choo api really [cleans up](https://github.com/krawaller/comparison/tree/master/choo/src) nicely!

```javascript
var html = require("choo/html");
var choo = require("choo");

var app = choo();

function confirmStore(state, emitter) {
  state.confirm = {
    button: "waiting"
  };
  emitter.on("maybe", function() {
    state.confirm.button = "confirm";
    emitter.emit("render");
  });

  emitter.on("cancel", function() {
    state.confirm.button = "waiting";
    emitter.emit("render");
  });

  emitter.on("confirm", function() {
    state.confirm.button = "waiting";
    state.submit = {
      field: "",
      submitted: state.submit.field
    };
    emitter.emit("render");
  });
}

function submitStore(state, emitter) {
  state.submit = {
    field: "",
    submitted: ""
  };
  emitter.on("setField", function(value) {
    state.submit.field = value;
    emitter.emit("render");
  });
}
const Confirm = (state, emit) => {
  let isWaiting = (state.confirm.button === "waiting");
  if (isWaiting) {
    const isDisabled = state.submit.field == "";
    return html`
      <button onclick=${() => { emit("maybe") }} disabled=${isDisabled}>Submit</button>`;
  } else {
    return html`
      <span>
        <button onclick=${() => {
          emit("cancel");
        }}>Cancel</button>
        <button onclick=${() => {
          emit("confirm");
        }}>Confirm</button>
      </span>
    `;
  }
};
const Submission = (state, emit) => {
  const onChange = e => {
    emit("setField", e.target.value);
  };
  return html`
  <body>
    <input value="${state.submit.field}" oninput=${onChange}/>
    ${Confirm(state, emit)}
    <p>Submitted value: ${state.submit.submitted}</p>
  </body>
  `;
};
app.use(confirmStore);
app.use(submitStore);
app.route("/", Submission);
app.mount("body");

```

## Nested buttons example

```javascript
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
  return {color:foregroundColor, backgroundColor}
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
function mainView (state, emit) {
  return html`<body>
  ${bm.render(state.buttons)}
  </body>`
}
```
