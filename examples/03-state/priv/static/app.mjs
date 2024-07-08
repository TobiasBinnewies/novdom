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

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
function to_string3(term) {
  return term.toString();
}
function console_log(term) {
  console.log(term);
}

// build/dev/javascript/gleam_stdlib/gleam/int.mjs
function to_string(x) {
  return to_string3(x);
}

// build/dev/javascript/gleam_stdlib/gleam/io.mjs
function println(string) {
  return console_log(string);
}

// build/dev/javascript/novdom/document_ffi.mjs
var TEXT = "_TEXT_";
var HTML = "_HTML_";
function init() {
  window.state_map = /* @__PURE__ */ new Map();
  window.stateful_component_map = /* @__PURE__ */ new Map();
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
function clear_viewport(id) {
  const viewport = document.getElementById(id);
  viewport.replaceChildren();
}
function get_element(comp) {
  if (comp.id === TEXT) {
    return comp.tag;
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
  add_to_unrendered(elem);
  return elem;
}
function set_attributes(comp, attributes) {
  const elem = get_element(comp);
  const keys = Object.keys(elem.attributes);
  keys.forEach((key) => {
    if (elem.attributes[key].name !== "id") {
      elem.removeAttribute(elem.attributes[key].name);
    }
  });
  attributes.toArray().forEach((attr) => add_attribute(comp, attr));
  return comp;
}
function add_attribute(comp, attribute) {
  const elem = get_element(comp);
  handle_attribute(elem, attribute[0], attribute[1], false);
  return comp;
}
function handle_attribute(elem, key, value2, remove) {
  if (value2 === "" || value2.length === 0) {
    elem.removeAttribute(key);
    return;
  }
  switch (key) {
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
        const split3 = style2.split(":");
        if (remove) {
          elem.style.removeProperty(split3[0]);
          return;
        }
        elem.style.setProperty(split3[0], split3[1].trim());
      });
      return;
    case "hidden":
      if (remove) {
        elem.hidden = false;
        return;
      }
      elem.hidden = true;
      return;
    default:
      if (remove) {
        elem.removeAttribute(key);
        return;
      }
      elem.setAttribute(key, value2);
      return;
  }
}
function add_listener(comp, listener) {
  const elem = get_element(comp);
  elem.addEventListener(listener[0], listener[1]);
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
function empty_component(tag) {
  let id = create_id();
  let comp = new Component(id, tag);
  get_element(new Component(id, tag));
  return comp;
}
function component(tag, children) {
  let comp = empty_component(tag);
  let children$1 = children(comp);
  set_children(comp, children$1);
  return comp;
}
var text_tag = "_TEXT_";
function text(value2) {
  return new Component(text_tag, value2);
}

// build/dev/javascript/novdom/novdom/attribute.mjs
function class$(value2) {
  return ["class", value2];
}

// build/dev/javascript/novdom/motion_ffi.mjs
function add_mouse_up_listener(fn) {
  document.getElementById("_app_").addEventListener("mouseup", fn);
}

// build/dev/javascript/novdom/novdom/listener.mjs
function onclick(component2, callback) {
  let _pipe = component2;
  return add_listener(
    _pipe,
    ["click", (_capture) => {
      return callback(component2, _capture);
    }]
  );
}

// build/dev/javascript/novdom/novdom/state.mjs
var State = class extends CustomType {
  constructor(id) {
    super();
    this.id = id;
  }
};
function from_id(id) {
  return new State(id);
}
function value(state) {
  return get_state(state.id);
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
function update2(state, new$2) {
  return update_state(state.id, new$2);
}
function render_children(state, parent, callback) {
  let cb = (value2) => {
    let _pipe = parent;
    set_children(_pipe, callback(value2));
    return void 0;
  };
  add_state_listener(state.id, cb);
  return callback(value(state));
}

// build/dev/javascript/novdom/novdom/motion.mjs
var drag_event_id = "_DRAGGABLE_";
function cleanup() {
  let state = from_id(drag_event_id);
  return () => {
    update2(state, new None());
    return clear_viewport("_drag_");
  };
}
function init2() {
  let drag_event = create_with_id(drag_event_id, new None());
  return add_mouse_up_listener(
    () => {
      let $ = value(drag_event);
      if ($ instanceof Some && !$[0].droppable) {
        let event = $[0];
        return event.cancel(event, cleanup());
      } else {
        return void 0;
      }
    }
  );
}

// build/dev/javascript/novdom/novdom/framework.mjs
function start(component2) {
  init();
  init2();
  let _pipe = component2();
  return add_to_viewport(_pipe, "_app_");
}

// build/dev/javascript/novdom/novdom/html.mjs
var div_tag = "div";
function div(attributes, children) {
  let _pipe = component(div_tag, children);
  return set_attributes(_pipe, attributes);
}

// build/dev/javascript/app/app.mjs
function main() {
  return start(
    () => {
      let counter = create(1);
      return div(
        toList([class$("p-5 bg-blue-100")]),
        (parent) => {
          return render_children(
            counter,
            parent,
            (value2) => {
              return toList([
                div(
                  toList([class$("p-2 bg-green-200 select-none")]),
                  (button) => {
                    let _pipe = button;
                    onclick(
                      _pipe,
                      (_, _1) => {
                        println("Button clicked!");
                        update2(counter, value2 + 1);
                        return void 0;
                      }
                    );
                    return toList([
                      text("current value: " + to_string(value2))
                    ]);
                  }
                )
              ]);
            }
          );
        }
      );
    }
  );
}

// build/.lustre/entry.mjs
main();
