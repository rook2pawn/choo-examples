const choo = require('choo')
const html = require('choo/html')
var app = choo()

function mainView (state, emit) {
  return html`<div class="container content">
    <h2>Nested buttons example</h2>
  ${buttonView(state,emit)}
  </div>`
}
function inputView (state, emit) {
  return html`<div class="container content">${titleView(state,emit)}</div>`
}
function submitView (state, emit) {
  return html`<div class="container content">${Submission(state,emit)}</div>`
}

app.use((state, emitter) => {
  emitter.on('navigate', () => {
    switch (state.route) {
      case '*' :
      $('.article').hide();
      $('div#c1').show();
      break;
      case 'input-example':
      $('.article').hide();
      $('div#c2').show();

      break;
      case 'submit-confirm':
      $('.article').hide();
      $('div#c3').show();

      break;
      default:
      break;
    }
    console.log(`Navigated to ${state.route}`) // 3.
  })
  emitter.on('DOMContentLoaded', () => {
    var hash = window.location.hash;
    console.log("on load hash:", hash);
    switch (hash) {
      case '' :
        $('div#c1').show()
      break;
      case '#input-example':
        $('div#c2').show()

      break;
      case '#submit-confirm':
        $('div#c3').show()

      break;
      default:
      break;
    }
  })

})
app.route("/choo-examples", mainView)
app.route("/choo-examples/input-example", inputView)
app.route("/choo-examples/submit-confirm", submitView)

app.mount('div#appEntry')
/* SUBMIT CONFIRM */

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
  <div>
  <h2>Submit confirm example</h2>
    <input value="${state.submit.field}" oninput=${onChange}/>
    ${Confirm(state, emit)}
    <p>Submitted value: ${state.submit.submitted}</p>
  </div>
  `;
};
app.use(confirmStore);
app.use(submitStore);


/* INPUT EXAMPLE */
function titleView (state, emit) {
  return html`
    <div>
    <h1>${state.title}</h1>
    <input
      type="text"
      value="${state.title}"
      oninput=${oninput} />
    </div>
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
app.use(titleStore)


/* BUTTONS EXAMPLE */

const getRandomColor = require("./getRandomColor")
const ButtonManager = require("./buttonManager")

var bm = new ButtonManager;

function buttonView (state, emit) {
  return html`<div>
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
