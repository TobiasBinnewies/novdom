// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label) => label in fields ? fields[label] : this[label]
    );
    return new this.constructor(...properties);
  }
};
var List = class {
  static fromArray(array, tail) {
    let t = tail || new Empty();
    for (let i = array.length - 1; i >= 0; --i) {
      t = new NonEmpty(array[i], t);
    }
    return t;
  }
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
  toArray() {
    return [...this];
  }
  // @internal
  atLeastLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return true;
      desired--;
    }
    return desired <= 0;
  }
  // @internal
  hasLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return false;
      desired--;
    }
    return desired === 0;
  }
  countLength() {
    let length2 = 0;
    for (let _ of this)
      length2++;
    return length2;
  }
};
function prepend(element, tail) {
  return new NonEmpty(element, tail);
}
function toList(elements, tail) {
  return List.fromArray(elements, tail);
}
var ListIterator = class {
  #current;
  constructor(current) {
    this.#current = current;
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true };
    } else {
      let { head, tail } = this.#current;
      this.#current = tail;
      return { value: head, done: false };
    }
  }
};
var Empty = class extends List {
};
var NonEmpty = class extends List {
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
  }
};
function makeError(variant, module, line, fn, message, extra) {
  let error = new globalThis.Error(message);
  error.gleam_error = variant;
  error.module = module;
  error.line = line;
  error.fn = fn;
  for (let k in extra)
    error[k] = extra[k];
  return error;
}

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var None = class extends CustomType {
};

// build/dev/javascript/gleam_stdlib/dict.mjs
var tempDataView = new DataView(new ArrayBuffer(8));
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
function do_reverse(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining;
    let accumulator = loop$accumulator;
    if (remaining.hasLength(0)) {
      return accumulator;
    } else {
      let item = remaining.head;
      let rest$1 = remaining.tail;
      loop$remaining = rest$1;
      loop$accumulator = prepend(item, accumulator);
    }
  }
}
function reverse(xs) {
  return do_reverse(xs, toList([]));
}
function do_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      loop$list = xs;
      loop$fun = fun;
      loop$acc = prepend(fun(x), acc);
    }
  }
}
function map(list, fun) {
  return do_map(list, fun, toList([]));
}
function fold(loop$list, loop$initial, loop$fun) {
  while (true) {
    let list = loop$list;
    let initial = loop$initial;
    let fun = loop$fun;
    if (list.hasLength(0)) {
      return initial;
    } else {
      let x = list.head;
      let rest$1 = list.tail;
      loop$list = rest$1;
      loop$initial = fun(initial, x);
      loop$fun = fun;
    }
  }
}
function each(loop$list, loop$f) {
  while (true) {
    let list = loop$list;
    let f = loop$f;
    if (list.hasLength(0)) {
      return void 0;
    } else {
      let x = list.head;
      let xs = list.tail;
      f(x);
      loop$list = xs;
      loop$f = f;
    }
  }
}

// build/dev/javascript/novdom/document_ffi.mjs
var HTML = "_HTML_";
function init() {
  window.state_map = /* @__PURE__ */ new Map();
  window.state_parameter_map = /* @__PURE__ */ new Map();
  window.state_parameter_last_value_map = /* @__PURE__ */ new Map();
  window.state_listener = /* @__PURE__ */ new Map();
}
function add_to_unrendered(elem) {
  document.getElementById("_unrendered_").appendChild(elem);
}
function add_to_viewport(comp, id) {
  const elem = get_element(comp);
  const viewport = document.getElementById(id);
  viewport.appendChild(elem);
}
function get_element(comp, children_comp) {
  if (comp.id === "document") {
    return document;
  }
  if (comp.id === HTML) {
    const html = document.createElement(HTML);
    html.insertAdjacentHTML("beforeend", comp.tag);
    return html;
  }
  const existing = document.getElementById(comp.id);
  if (existing) {
    return existing;
  }
  const elem = document.createElement(comp.tag);
  elem.setAttribute("id", comp.id);
  try {
    const children = children_comp.toArray().map(get_element);
    elem.replaceChildren(...children);
  } catch (_) {
    elem.textContent = children_comp;
  }
  add_to_unrendered(elem);
  return elem;
}
function add_attribute(comp, name, value2) {
  const elem = get_element(comp);
  handle_attribute(elem, name, value2, false);
  return comp;
}
function remove_attribute(comp, name, value2) {
  const elem = get_element(comp);
  handle_attribute(elem, name, value2, true);
  return comp;
}
function handle_attribute(elem, name, value2, remove) {
  if (value2 === "" || value2.length === 0) {
    elem.removeAttribute(name);
    return;
  }
  switch (name) {
    case "class":
      value2.split(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls);
          return;
        }
        elem.classList.add(cls);
      });
      return;
    case "style":
      value2.split(";").forEach((style2) => {
        if (!style2.includes(":")) {
          elem.style.setProperty(style2, "");
          return;
        }
        const split2 = style2.split(":");
        if (remove) {
          elem.style.removeProperty(split2[0]);
          return;
        }
        elem.style.setProperty(split2[0], split2[1].trim());
      });
      return;
    default:
      if (remove) {
        elem.removeAttribute(name);
        return;
      }
      elem.setAttribute(name, value2);
      return;
  }
}
function add_listener(comp, name, callback) {
  const elem = get_element(comp);
  elem.addEventListener(name, callback);
  return comp;
}
function remove_listener(comp, name, callback) {
  const elem = get_element(comp);
  elem.removeEventListener(name, callback);
  return comp;
}
function set_children(comp, children_comp) {
  const elem = get_element(comp);
  const children = children_comp.toArray().map(get_element);
  elem.replaceChildren(...children);
  return comp;
}
function update_state(id, value2) {
  ;
  (window.state_listener.get(id) || []).forEach((callback) => callback(value2));
  set_state(id, value2);
}
function set_state(id, value2) {
  window.state_map.set(id, value2);
}
function get_state(id) {
  return window.state_map.get(id);
}
function add_state_listener(id, callback) {
  let current = window.state_listener.get(id) || [];
  window.state_listener.set(id, [callback, ...current]);
}
function add_state_parameter(comp, state_param_id) {
  window.state_parameter_map.set(state_param_id, comp.id);
  return comp;
}
function get_component_id_from_state_param_id(id) {
  return window.state_parameter_map.get(id);
}
function store_mouse_position(e) {
  const drag = document.getElementById("_drag_");
  drag.style.setProperty("--mouse-x", e.clientX + "px");
  drag.style.setProperty("--mouse-y", e.clientY + "px");
}

// build/dev/javascript/gleam_stdlib/gleam/function.mjs
function tap(arg, effect) {
  effect(arg);
  return arg;
}

// build/dev/javascript/novdom/utils_ffi.mjs
function create_id() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
}

// build/dev/javascript/novdom/novdom/component.mjs
var Component = class extends CustomType {
  constructor(id, tag) {
    super();
    this.id = id;
    this.tag = tag;
  }
};
function document2() {
  return new Component("document", "");
}
function drag_component() {
  return new Component("_drag_", "");
}
function get_component(id) {
  return new Component(id, "");
}
function component(tag, children) {
  let _pipe = create_id();
  let _pipe$1 = new Component(_pipe, tag);
  return tap(
    _pipe$1,
    (_capture) => {
      return get_element(_capture, children);
    }
  );
}
var text_tag = "_TEXT_";
function text(value2) {
  let _pipe = create_id();
  let _pipe$1 = new Component(_pipe, text_tag);
  return tap(
    _pipe$1,
    (_capture) => {
      return get_element(_capture, value2);
    }
  );
}

// build/dev/javascript/novdom/novdom/internals/parameter.mjs
var Attribute = class extends CustomType {
  constructor(name, value2) {
    super();
    this.name = name;
    this.value = value2;
  }
};
var Listener = class extends CustomType {
  constructor(name, callback) {
    super();
    this.name = name;
    this.callback = callback;
  }
};
var Modifier = class extends CustomType {
  constructor(name, callback) {
    super();
    this.name = name;
    this.callback = callback;
  }
};
var StateParameter = class extends CustomType {
  constructor(id, initial) {
    super();
    this.id = id;
    this.initial = initial;
  }
};
function remove_parameters(component2, params) {
  each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        let key = param.name;
        let value2 = param.value;
        return remove_attribute(component2, key, value2);
      } else if (param instanceof Listener) {
        let name = param.name;
        let callback = param.callback;
        return remove_listener(component2, name, callback);
      } else {
        throw makeError(
          "panic",
          "novdom/internals/parameter",
          49,
          "",
          "Can only remove attributes and listeners",
          {}
        );
      }
    }
  );
  return component2;
}
function set_parameters(component2, params) {
  each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        let key = param.name;
        let value2 = param.value;
        return add_attribute(component2, key, value2);
      } else if (param instanceof Listener) {
        let name = param.name;
        let callback = param.callback;
        return add_listener(component2, name, callback);
      } else if (param instanceof Modifier) {
        let name = param.name;
        let callback = param.callback;
        throw makeError(
          "todo",
          "novdom/internals/parameter",
          27,
          "",
          "Implement add_modifier",
          {}
        );
      } else if (param instanceof StateParameter) {
        let id = param.id;
        let initial = param.initial;
        let _pipe = component2;
        let _pipe$1 = add_state_parameter(_pipe, id);
        return set_parameters(_pipe$1, initial);
      } else {
        let params$1 = param[0];
        return set_parameters(component2, params$1);
      }
    }
  );
  return component2;
}

// build/dev/javascript/novdom/novdom/attribute.mjs
function class$(value2) {
  return new Attribute("class", value2);
}
function style(values) {
  let res = fold(
    values,
    "",
    (res2, _use1) => {
      let key = _use1[0];
      let value2 = _use1[1];
      if (value2 === "") {
        return res2 + key + ";";
      } else {
        return res2 + key + ":" + value2 + ";";
      }
    }
  );
  return new Attribute("style", res);
}
function hidden() {
  return new Attribute("hidden", "hidden");
}

// build/dev/javascript/novdom/novdom/html.mjs
var div_tag = "div";
function div(parameters, children) {
  let _pipe = component(div_tag, children);
  return set_parameters(_pipe, parameters);
}

// build/dev/javascript/novdom/novdom/container.mjs
var Top = class extends CustomType {
};
var Bottom = class extends CustomType {
};
var Left = class extends CustomType {
};
var Right = class extends CustomType {
};
var Center = class extends CustomType {
};
var TopLeft = class extends CustomType {
};
var TopRight = class extends CustomType {
};
var BottomLeft = class extends CustomType {
};
function zstack(alignment, children) {
  let position = (() => {
    if (alignment instanceof Top) {
      return toList([["left", "50%"], ["transform", "translateX(-50%)"]]);
    } else if (alignment instanceof Bottom) {
      return toList([
        ["left", "50%"],
        ["bottom", "0"],
        ["transform", "translateX(-50%)"]
      ]);
    } else if (alignment instanceof Left) {
      return toList([["top", "50%"], ["transform", "translateY(-50%)"]]);
    } else if (alignment instanceof Right) {
      return toList([
        ["top", "50%"],
        ["right", "0"],
        ["transform", "translateY(-50%)"]
      ]);
    } else if (alignment instanceof Center) {
      return toList([
        ["top", "50%"],
        ["left", "50%"],
        ["transform", "translate(-50%, -50%)"]
      ]);
    } else if (alignment instanceof TopLeft) {
      return toList([]);
    } else if (alignment instanceof TopRight) {
      return toList([["right", "0"]]);
    } else if (alignment instanceof BottomLeft) {
      return toList([["bottom", "0"]]);
    } else {
      return toList([["bottom", "0"], ["right", "0"]]);
    }
  })();
  let children$1 = map(
    children,
    (c) => {
      return div(
        toList([
          style(
            prepend(
              ["position", "absolute"],
              prepend(
                ["min-width", "max-content"],
                prepend(
                  ["min-height", "max-content"],
                  prepend(["overflow", "hidden"], position)
                )
              )
            )
          )
        ]),
        toList([c])
      );
    }
  );
  return div(
    toList([
      style(
        toList([
          ["display", "block"],
          ["position", "relative"],
          ["height", "100%"],
          ["width", "100%"]
        ])
      )
    ]),
    children$1
  );
}

// build/dev/javascript/novdom/novdom/listener.mjs
function onclick(callback) {
  return new Listener("click", callback);
}
function onmousemove(callback) {
  return new Listener("mousemove", callback);
}
function onmouseup(callback) {
  return new Listener("mouseup", callback);
}

// build/dev/javascript/novdom/novdom/state.mjs
var State = class extends CustomType {
  constructor(state_id) {
    super();
    this.state_id = state_id;
  }
};
function from_id(id) {
  return new State(id);
}
function value(state) {
  return get_state(state.state_id);
}
function create(init3) {
  let id = create_id();
  set_state(id, init3);
  return new State(id);
}
function create_with_id(id, init3) {
  set_state(id, init3);
  return new State(id);
}
function update(state, new$2) {
  return update_state(state.state_id, new$2);
}
function listen(state, callback) {
  return add_state_listener(state.state_id, callback);
}

// build/dev/javascript/novdom/novdom/state_parameter.mjs
function check(params) {
  return each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        return void 0;
      } else if (param instanceof Listener) {
        return void 0;
      } else {
        throw makeError(
          "panic",
          "novdom/state_parameter",
          151,
          "",
          "Only attributes and listeners are allowed",
          {}
        );
      }
    }
  );
}
function if1(state, when, then$) {
  check(then$);
  let state_param_id = create_id();
  let callback = (a) => {
    let component2 = (() => {
      let _pipe = state_param_id;
      let _pipe$1 = get_component_id_from_state_param_id(_pipe);
      return get_component(_pipe$1);
    })();
    let $ = when(a);
    if ($) {
      set_parameters(component2, then$);
    } else {
      remove_parameters(component2, then$);
    }
    return void 0;
  };
  listen(state, callback);
  let initial = (() => {
    let $ = when(value(state));
    if ($) {
      return then$;
    } else {
      return toList([]);
    }
  })();
  return new StateParameter(state_param_id, initial);
}

// build/dev/javascript/novdom/novdom/state_component.mjs
var state_component_tag = "_STATE_COMPONENT_";
function if12(state, when, then$) {
  let _pipe = component(state_component_tag, then$);
  return set_parameters(
    _pipe,
    toList([
      if1(
        state,
        (a) => {
          return !when(a);
        },
        toList([hidden()])
      )
    ])
  );
}
function utilize(state, do$) {
  let children = do$(value(state));
  let comp = component(state_component_tag, children);
  let callback = (a) => {
    let _pipe = comp;
    set_children(_pipe, do$(a));
    return void 0;
  };
  listen(state, callback);
  return comp;
}

// build/dev/javascript/novdom/novdom/motion.mjs
var drag_event_id = "_DRAGGABLE_";
function cleanup() {
  let state = from_id(drag_event_id);
  return () => {
    return update(state, new None());
  };
}
function init2() {
  let drag_event = create_with_id(drag_event_id, new None());
  let _pipe = document2();
  set_parameters(
    _pipe,
    toList([
      onmouseup(
        (_) => {
          let $ = value(drag_event);
          if ($ instanceof Some && !$[0].droppable) {
            let event = $[0];
            return event.cancel(event, cleanup());
          } else {
            return void 0;
          }
        }
      ),
      onmousemove((e) => {
        return store_mouse_position(e);
      })
    ])
  );
  let _pipe$1 = drag_component();
  return set_children(
    _pipe$1,
    toList([
      utilize(
        drag_event,
        (event) => {
          if (event instanceof Some) {
            let event$1 = event[0];
            return toList([event$1.preview]);
          } else {
            return toList([]);
          }
        }
      )
    ])
  );
}

// build/dev/javascript/novdom/novdom/framework.mjs
function start(component2) {
  init();
  init2();
  let _pipe = component2();
  return add_to_viewport(_pipe, "_app_");
}

// build/dev/javascript/app/app.mjs
function main() {
  return start(
    () => {
      let state = create("Hello, world!");
      return zstack(
        new Right(),
        toList([
          div(
            toList([class$("p-10 bg-green-100 select-none")]),
            toList([text("Hello, world!")])
          ),
          div(
            toList([
              class$("p-5 bg-blue-100 select-none"),
              onclick((_) => {
                return update(state, "NEW");
              })
            ]),
            toList([text("Hello, world!")])
          ),
          utilize(
            state,
            (value2) => {
              return toList([text(value2)]);
            }
          ),
          if12(
            state,
            (v) => {
              return v === "Hello, world!";
            },
            toList([
              div(
                toList([class$("p-5 bg-red-100 select-none")]),
                toList([text("Hello, world!")])
              )
            ])
          )
        ])
      );
    }
  );
}

// build/.lustre/entry.mjs
main();
