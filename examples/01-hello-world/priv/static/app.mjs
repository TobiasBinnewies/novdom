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
function add_attribute(comp, name, value) {
  const elem = get_element(comp);
  handle_attribute(elem, name, value, false);
  return comp;
}
function handle_attribute(elem, name, value, remove) {
  if (value === "" || value.length === 0) {
    elem.removeAttribute(name);
    return;
  }
  switch (name) {
    case "class":
      value.split(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls);
          return;
        }
        elem.classList.add(cls);
      });
      return;
    case "style":
      value.split(";").forEach((style) => {
        if (!style.includes(":")) {
          elem.style.setProperty(style, "");
          return;
        }
        const split2 = style.split(":");
        if (remove) {
          elem.style.removeProperty(split2[0]);
          return;
        }
        elem.style.setProperty(split2[0], split2[1].trim());
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
        elem.removeAttribute(name);
        return;
      }
      elem.setAttribute(name, value);
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
function text(value) {
  return new Component(text_tag, value);
}

// build/dev/javascript/novdom/novdom/internals/parameter.mjs
var Attribute = class extends CustomType {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
};
var Listener = class extends CustomType {
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
        let value = param.value;
        return add_attribute(component2, key, value);
      } else if (param instanceof Listener) {
        let name = param.name;
        let callback = param.callback;
        return add_listener(component2, name, callback);
      } else {
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
      }
    }
  );
  return component2;
}

// build/dev/javascript/novdom/novdom/attribute.mjs
function class$(value) {
  return new Attribute("class", value);
}

// build/dev/javascript/novdom/novdom/framework.mjs
function start(component2) {
  init();
  let _pipe = component2();
  return add_to_viewport(_pipe, "_app_");
}

// build/dev/javascript/novdom/novdom/html.mjs
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
        toList([class$("p-5 bg-blue-100 select-none")]),
        (parent) => {
          return toList([text("Hello, world!")]);
        }
      );
    }
  );
}

// build/.lustre/entry.mjs
main();
