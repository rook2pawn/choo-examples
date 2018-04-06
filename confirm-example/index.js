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
