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
function do_append(loop$first, loop$second) {
  while (true) {
    let first = loop$first;
    let second = loop$second;
    if (first.hasLength(0)) {
      return second;
    } else {
      let item = first.head;
      let rest$1 = first.tail;
      loop$first = rest$1;
      loop$second = prepend(item, second);
    }
  }
}
function append(first, second) {
  return do_append(reverse(first), second);
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

// build/dev/javascript/gleam_stdlib/dict.mjs
var tempDataView = new DataView(new ArrayBuffer(8));
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
function join(xs, separator) {
  const iterator = xs[Symbol.iterator]();
  let result = iterator.next().value || "";
  let current = iterator.next();
  while (!current.done) {
    result = result + separator + current.value;
    current = iterator.next();
  }
  return result;
}

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function join2(strings, separator) {
  return join(strings, separator);
}

// build/dev/javascript/iui/libs/attribute.mjs
function class$(value) {
  return ["class", value];
}
function style(values) {
  let res = fold(
    values,
    "",
    (res2, _use1) => {
      let key = _use1[0];
      let value = _use1[1];
      return res2 + key + ":" + value + ";";
    }
  );
  return ["style", res];
}

// build/dev/javascript/iui/libs/component.mjs
var Component = class extends CustomType {
  constructor(tag, attributes, children, listeners) {
    super();
    this.tag = tag;
    this.attributes = attributes;
    this.children = children;
    this.listeners = listeners;
  }
};
var TextContainer = class extends CustomType {
  constructor(value) {
    super();
    this.value = value;
  }
};
var StateContainer = class extends CustomType {
  constructor(state_id) {
    super();
    this.state_id = state_id;
  }
};
var StatefulComponent = class extends CustomType {
  constructor(state_id, component_id) {
    super();
    this.state_id = state_id;
    this.component_id = component_id;
  }
};
function component(tag) {
  return new Component(tag, toList([]), toList([]), toList([]));
}
function with_attributes(component2, attr) {
  if (component2 instanceof Component) {
    let tag = component2.tag;
    let current_attrs = component2.attributes;
    let children = component2.children;
    let listener = component2.listeners;
    return new Component(
      tag,
      append(current_attrs, attr),
      children,
      listener
    );
  } else {
    throw makeError(
      "panic",
      "libs/component",
      34,
      "with_attributes",
      "Only Component can have attributes",
      {}
    );
  }
}
function with_children(component2, children) {
  if (component2 instanceof Component) {
    let tag = component2.tag;
    let attributes = component2.attributes;
    let listener = component2.listeners;
    return new Component(tag, attributes, children, listener);
  } else {
    throw makeError(
      "panic",
      "libs/component",
      55,
      "with_children",
      "Only Component can have children",
      {}
    );
  }
}

// build/dev/javascript/iui/libs/container.mjs
var VLeft = class extends CustomType {
};
var VRight = class extends CustomType {
};
var VCenter = class extends CustomType {
};
var HTop = class extends CustomType {
};
var HBottom = class extends CustomType {
};
var HCenter = class extends CustomType {
};
var Gap = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var NoSpacing = class extends CustomType {
};
var EvenSpacing = class extends CustomType {
};
var BetweenSpacing = class extends CustomType {
};
var VerticalDirection = class extends CustomType {
};
var HorizontalDirection = class extends CustomType {
};
var VerticalScroll = class extends CustomType {
};
var HorizontalScroll = class extends CustomType {
};
var Scroll = class extends CustomType {
};
var NoScroll = class extends CustomType {
};
var stack_tag = "_stack_";
function stack(direction, align, spacing, scrolling, children) {
  let spacing$1 = (() => {
    if (spacing instanceof Gap) {
      let value = spacing[0];
      return ["gap", value];
    } else if (spacing instanceof NoSpacing) {
      return ["gap", "0"];
    } else if (spacing instanceof EvenSpacing) {
      return ["justify-content", "space-evenly"];
    } else if (spacing instanceof BetweenSpacing) {
      return ["justify-content", "space-between"];
    } else {
      return ["justify-content", "space-around"];
    }
  })();
  let direction$1 = (() => {
    if (direction instanceof VerticalDirection) {
      return "column";
    } else {
      return "row";
    }
  })();
  let overflow = (() => {
    if (scrolling instanceof VerticalScroll) {
      return ["overflow-y", "auto"];
    } else if (scrolling instanceof HorizontalScroll) {
      return ["overflow-x", "auto"];
    } else if (scrolling instanceof Scroll) {
      return ["overflow", "auto"];
    } else {
      return ["overflow", "hidden"];
    }
  })();
  let _pipe = component(stack_tag);
  let _pipe$1 = with_attributes(
    _pipe,
    toList([
      style(
        toList([
          ["height", "100%"],
          ["display", "flex"],
          ["flex-direction", direction$1],
          ["align-items", align],
          overflow,
          spacing$1
        ])
      )
    ])
  );
  return with_children(_pipe$1, children);
}
function vstack(alignment, spacing, children) {
  let align = (() => {
    if (alignment instanceof VLeft) {
      return "flex-start";
    } else if (alignment instanceof VRight) {
      return "flex-end";
    } else {
      return "center";
    }
  })();
  return stack(
    new VerticalDirection(),
    align,
    spacing,
    new NoScroll(),
    children
  );
}
function hstack(alignment, spacing, children) {
  let align = (() => {
    if (alignment instanceof HTop) {
      return "flex-start";
    } else if (alignment instanceof HBottom) {
      return "flex-end";
    } else {
      return "center";
    }
  })();
  return stack(
    new HorizontalDirection(),
    align,
    spacing,
    new NoScroll(),
    children
  );
}

// build/dev/javascript/iui/document_ffi.mjs
var TEXT = "_TEXT_";
var STATE = "_STATE_";
var STATEFUL = "_STATEFUL_";
function init() {
  window.state_map = /* @__PURE__ */ new Map();
  window.stateful_component_map = /* @__PURE__ */ new Map();
}
function create_text_element(value) {
  const elem = document.createElement(TEXT);
  elem.innerText = value;
  return elem;
}
function create_state_element(state_id) {
  const elem = document.createElement(STATE);
  const value = get_state(state_id);
  elem.setAttribute("class", state_id);
  elem.innerText = value;
  return elem;
}
function create_stateful_element(component_id, state_id, child) {
  const elem = document.createElement(STATEFUL);
  const value = get_state(state_id);
  const render = get_stateful_component(component_id);
  elem.setAttribute("id", component_id);
  elem.setAttribute("class", state_id);
  elem.setAttribute("style", "height: 100%; width: 100%;");
  elem.appendChild(render(value));
  return elem;
}
function create_element(tag, attributes, children, listeners) {
  const elem = document.createElement(tag);
  children.toArray().forEach((child) => elem.appendChild(child));
  attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]));
  if (listeners) {
    listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]));
  }
  return elem;
}
function add_to_viewport(id, elem) {
  const viewport = document.querySelector(id);
  viewport.appendChild(elem);
}
function set_state(id, value, to_string4) {
  window.state_map.set(id, { value, to_string: to_string4 });
}
function get_state(id) {
  return window.state_map.get(id).value;
}
function add_stateful_component(id, render) {
  window.stateful_component_map.set(id, render);
}
function get_stateful_component(id) {
  return window.stateful_component_map.get(id);
}

// build/dev/javascript/iui/libs/framework.mjs
function get_element(component2) {
  if (component2 instanceof Component) {
    let el = component2.tag;
    let attributes = component2.attributes;
    let children = component2.children;
    let listener = component2.listeners;
    let children$1 = map(children, get_element);
    return create_element(el, attributes, children$1, listener);
  } else if (component2 instanceof TextContainer) {
    let value = component2.value;
    return create_text_element(value);
  } else if (component2 instanceof StateContainer) {
    let state_id = component2.state_id;
    return create_state_element(state_id);
  } else {
    let state_id = component2.state_id;
    let component_id = component2.component_id;
    return create_stateful_element(component_id, state_id);
  }
}
function start(component2) {
  let element = get_element(component2);
  return add_to_viewport("#app", element);
}

// build/dev/javascript/iui/libs/html.mjs
function text(value) {
  return new TextContainer(value);
}
var div_tag = "div";
function div(attributes, children) {
  let _pipe = component(div_tag);
  let _pipe$1 = with_attributes(_pipe, attributes);
  return with_children(_pipe$1, children);
}

// build/dev/javascript/iui/utils_ffi.mjs
function create_id() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
}

// build/dev/javascript/iui/libs/state.mjs
var State = class extends CustomType {
  constructor(id) {
    super();
    this.id = id;
  }
};
function create(init2, to_string4) {
  let id = create_id();
  set_state(id, init2, to_string4);
  return new State(id);
}
function stateful_component(state, render) {
  let id = create_id();
  let render$1 = (a) => {
    let comp = render(a);
    return get_element(comp);
  };
  add_stateful_component(id, render$1);
  return new StatefulComponent(state.id, id);
}

// build/dev/javascript/iui/iui.mjs
function panel1(state) {
  return stateful_component(
    state,
    (letters) => {
      return hstack(
        new HCenter(),
        new EvenSpacing(),
        map(
          letters,
          (letter) => {
            return div(
              toList([class$("p-5 bg-blue-100")]),
              toList([text(letter)])
            );
          }
        )
      );
    }
  );
}
function panel2(state) {
  return stateful_component(
    state,
    (letters) => {
      return hstack(
        new HCenter(),
        new EvenSpacing(),
        map(
          letters,
          (letter) => {
            return div(
              toList([class$("p-5 bg-green-100")]),
              toList([text(letter)])
            );
          }
        )
      );
    }
  );
}
function main() {
  init();
  let state1 = create(
    toList(["A", "B", "C"]),
    (a) => {
      return join2(a, ", ");
    }
  );
  let state2 = create(
    toList(["D", "E"]),
    (a) => {
      return join2(a, ", ");
    }
  );
  let component2 = vstack(
    new VCenter(),
    new EvenSpacing(),
    toList([panel1(state1), panel2(state2)])
  );
  return start(component2);
}

// build/.lustre/entry.mjs
main();
