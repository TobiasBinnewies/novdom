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

// build/dev/javascript/novdom/novdom/listener.mjs
function onmousemove(callback) {
  return new Listener("mousemove", callback);
}
function onmouseup(callback) {
  return new Listener("mouseup", callback);
}
function onkeydown(callback) {
  return new Listener("keydown", callback);
}

// build/dev/javascript/novdom/novdom/hotkey.mjs
function init() {
  let _pipe = document2();
  set_parameters(_pipe, toList([onkeydown(keypress_callback)]));
  return void 0;
}

// build/dev/javascript/novdom/document_ffi.mjs
var HTML = "_HTML_";
String.prototype.smartSplit = function(separator) {
  return this.split(separator).filter((s) => s.length > 0);
};
Array.prototype.toList = function() {
  return List.fromArray(this);
};
function init2() {
  globalThis.state_map = /* @__PURE__ */ new Map();
  globalThis.parameter_component_map = /* @__PURE__ */ new Map();
  globalThis.state_parameter_last_value_map = /* @__PURE__ */ new Map();
  globalThis.state_listener = /* @__PURE__ */ new Map();
  globalThis.reference_map = /* @__PURE__ */ new Map();
  globalThis.hotkey_key_map = /* @__PURE__ */ new Map();
  globalThis.hotkey_id_map = /* @__PURE__ */ new Map();
  globalThis.hotkey_listener = /* @__PURE__ */ new Map();
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
    const text3 = document.createTextNode(children_comp.replace(" ", "\xA0"));
    elem.replaceChildren(text3);
  }
  add_to_unrendered(elem);
  return elem;
}
function add_parameter(comp, param_id) {
  globalThis.parameter_component_map.set(param_id, comp.id);
  return comp;
}
function add_attribute(comp, name, value2) {
  const elem = get_element(comp);
  handle_attribute(elem, name, value2, false);
  return comp;
}
function handle_attribute(elem, name, value2, remove) {
  if (value2 === "" || value2.length === 0) {
    elem.removeAttribute(name);
    return;
  }
  switch (name) {
    case "class":
      value2.smartSplit(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls);
          return;
        }
        elem.classList.add(cls);
      });
      return;
    case "style":
      value2.smartSplit(";").forEach((style2) => {
        if (!style2.includes(":")) {
          elem.style.setProperty(style2, "");
          return;
        }
        const split2 = style2.smartSplit(":");
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
function set_children(comp, children_comp) {
  const elem = get_element(comp);
  const children = children_comp.toArray().map(get_element);
  elem.replaceChildren(...children);
  return comp;
}
function update_state(id, value2) {
  ;
  (globalThis.state_listener.get(id) || []).forEach((callback) => callback(value2));
  set_state(id, value2);
}
function set_state(id, value2) {
  globalThis.state_map.set(id, value2);
}
function get_state(id) {
  return globalThis.state_map.get(id);
}
function add_state_listener(id, callback) {
  let current = globalThis.state_listener.get(id) || [];
  globalThis.state_listener.set(id, [callback, ...current]);
}
function encode_key(key) {
  let is_short = key.ctrlKey || key.metaKey;
  let is_shift = key.shiftKey;
  let is_alt = key.altKey;
  if (key.modifiers) {
    const modifier_names = key.modifiers.toArray().map((m) => m.constructor.name);
    is_short = modifier_names.includes("Short");
    is_shift = modifier_names.includes("Shift");
    is_alt = modifier_names.includes("Alt");
  }
  return key.code + ";" + (is_shift ? "Shift," : "") + (is_alt ? "Alt," : "") + (is_short ? "Short," : "");
}
function keypress_callback(event) {
  const pressed_key = encode_key(event);
  const ids = globalThis.hotkey_key_map.get(pressed_key) || [];
  if (ids.length === 0) {
    return;
  }
  event.preventDefault();
  ids.forEach((id) => globalThis.hotkey_listener.get(id)(event));
}
function store_mouse_position(e) {
  const drag = document.getElementById("_drag_");
  drag.style.setProperty("--mouse-x", e.clientX + "px");
  drag.style.setProperty("--mouse-y", e.clientY + "px");
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
          "panic",
          "novdom/internals/parameter",
          26,
          "",
          "Implement add_modifier",
          {}
        );
      } else {
        let id = param.id;
        let params$1 = param[1];
        let _pipe = component2;
        let _pipe$1 = add_parameter(_pipe, id);
        return set_parameters(_pipe$1, params$1);
      }
    }
  );
  return component2;
}

// build/dev/javascript/novdom/novdom/attribute.mjs
function class$(value2) {
  return new Attribute("class", value2);
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
function create_with_id(id, init4) {
  set_state(id, init4);
  return new State(id);
}
function update(state, new$2) {
  return update_state(state.state_id, new$2);
}
function listen(state, callback) {
  return add_state_listener(state.state_id, callback);
}

// build/dev/javascript/novdom/novdom/state_component.mjs
var state_component_tag = "_STATE_COMPONENT_";
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
function init3() {
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
  init2();
  init3();
  init();
  let _pipe = component2();
  return add_to_viewport(_pipe, "_app_");
}

// build/dev/javascript/novdom/novdom/html.mjs
function text2(parameters, value2) {
  let _pipe = text(value2);
  return set_parameters(_pipe, parameters);
}
var div_tag = "div";
function div(parameters, children) {
  let _pipe = component(div_tag, children);
  return set_parameters(_pipe, parameters);
}

// build/dev/javascript/app/app.mjs
function main() {
  return start(
    () => {
      return div(
        toList([
          class$(
            "p-5 bg-[#272822] select-none flex justify-center items-center h-screen w-screen size-100 text-2xl font-mono"
          )
        ]),
        toList([
          text2(toList([class$("text-white")]), "<"),
          text2(toList([class$("text-[#F82873] ")]), "Hello"),
          text2(toList([]), " "),
          text2(toList([class$("text-[#A7E230]")]), "World"),
          text2(toList([class$("text-white")]), "/>")
        ])
      );
    }
  );
}

// build/.lustre/entry.mjs
main();
