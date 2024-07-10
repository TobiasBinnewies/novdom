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
function do_filter(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      let new_acc = (() => {
        let $ = fun(x);
        if ($) {
          return prepend(x, acc);
        } else {
          return acc;
        }
      })();
      loop$list = xs;
      loop$fun = fun;
      loop$acc = new_acc;
    }
  }
}
function filter(list, predicate) {
  return do_filter(list, predicate, toList([]));
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
function create_copy(comp, new_id) {
  const elem = get_element(comp);
  const copy2 = elem.cloneNode(true);
  copy2.setAttribute("id", new_id);
  add_to_unrendered(copy2);
  return { id: new_id, tag: comp.tag };
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
function remove_attribute(comp, attribute) {
  const elem = get_element(comp);
  handle_attribute(elem, attribute[0], attribute[1], true);
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
        const split2 = style2.split(":");
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
function copy(comp) {
  let id = create_id();
  return create_copy(comp, id);
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
  return ["style", res];
}
function hidden() {
  return ["hidden", "hidden"];
}

// build/dev/javascript/novdom/novdom/container.mjs
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
var stack_tag = "_STACK_";
function stack(direction, align, spacing, scrolling, children) {
  let spacing$1 = (() => {
    if (spacing instanceof Gap) {
      let value2 = spacing[0];
      return ["gap", value2];
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
  let _pipe = component(stack_tag, children);
  return set_attributes(
    _pipe,
    toList([
      style(
        toList([
          ["height", "100%"],
          ["width", "100%"],
          ["display", "flex"],
          ["flex-direction", direction$1],
          ["align-items", align],
          overflow,
          spacing$1
        ])
      )
    ])
  );
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

// build/dev/javascript/novdom/motion_ffi.mjs
function add_mouse_up_listener(fn) {
  document.getElementById("_app_").addEventListener("mouseup", fn);
}

// build/dev/javascript/novdom/novdom/listener.mjs
function onemouseover(component2, callback) {
  let _pipe = component2;
  return add_listener(
    _pipe,
    ["mouseover", (_capture) => {
      return callback(component2, _capture);
    }]
  );
}
function onmouseout(component2, callback) {
  let _pipe = component2;
  return add_listener(
    _pipe,
    ["mouseout", (_capture) => {
      return callback(component2, _capture);
    }]
  );
}
function onmousedown(component2, callback) {
  let _pipe = component2;
  return add_listener(
    _pipe,
    ["mousedown", (_capture) => {
      return callback(component2, _capture);
    }]
  );
}
function onmouseup(component2, callback) {
  let _pipe = component2;
  return add_listener(
    _pipe,
    ["mouseup", (_capture) => {
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
function update(state, new$2) {
  return update_state(state.id, new$2);
}
function listen(state, callback) {
  return add_state_listener(state.id, callback);
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
var DragEvent = class extends CustomType {
  constructor(value2, source, preview, drop, cancel, droppable) {
    super();
    this.value = value2;
    this.source = source;
    this.preview = preview;
    this.drop = drop;
    this.cancel = cancel;
    this.droppable = droppable;
  }
};
var drag_event_id = "_DRAGGABLE_";
function ondrag(comp, preview, value2, on_drag, on_cancel, on_drop) {
  let drag_event = from_id(drag_event_id);
  let preview$1 = (() => {
    let _pipe2 = empty_component(drag_event_id);
    let _pipe$1 = add_attribute(
      _pipe2,
      style(
        toList([
          ["position", "absolute"],
          ["top", "var(--mouse-y)"],
          ["left", "var(--mouse-x)"],
          ["min-width", "20px"],
          ["min-height", "20px"]
        ])
      )
    );
    return set_children(_pipe$1, toList([preview]));
  })();
  let _pipe = comp;
  return onmousedown(
    _pipe,
    (_, _1) => {
      let event = new DragEvent(
        value2,
        comp,
        preview$1,
        on_drop,
        on_cancel,
        false
      );
      update(drag_event, new Some(event));
      add_to_viewport(
        (() => {
          let _pipe$1 = preview$1;
          return copy(_pipe$1);
        })(),
        "_drag_"
      );
      return on_drag(event);
    }
  );
}
function cleanup() {
  let state = from_id(drag_event_id);
  return () => {
    update(state, new None());
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
function ondrop(comp, on_drag, on_hover, on_drop) {
  let drag_event = from_id(drag_event_id);
  let _pipe = drag_event;
  listen(
    _pipe,
    (event) => {
      if (event instanceof Some && !event[0].droppable) {
        let event$1 = event[0];
        return on_drag(event$1);
      } else {
        return void 0;
      }
    }
  );
  let _pipe$1 = comp;
  let _pipe$2 = onemouseover(
    _pipe$1,
    (_, _1) => {
      let $ = value(drag_event);
      if ($ instanceof Some && $[0] instanceof DragEvent) {
        let value2 = $[0].value;
        let source = $[0].source;
        let preview = $[0].preview;
        let cleanup$1 = $[0].drop;
        let cancel = $[0].cancel;
        let droppable = $[0].droppable;
        let event = new DragEvent(
          value2,
          source,
          preview,
          cleanup$1,
          cancel,
          droppable
        );
        return update(
          drag_event,
          new Some(
            new DragEvent(
              value2,
              source,
              preview,
              cleanup$1,
              cancel,
              on_hover(event)
            )
          )
        );
      } else {
        return void 0;
      }
    }
  );
  let _pipe$3 = onmouseout(
    _pipe$2,
    (_, _1) => {
      let $ = value(drag_event);
      if ($ instanceof Some) {
        let event = $[0];
        return update(
          drag_event,
          new Some(
            new DragEvent(
              event.value,
              event.source,
              event.preview,
              event.drop,
              event.cancel,
              false
            )
          )
        );
      } else {
        return void 0;
      }
    }
  );
  return onmouseup(
    _pipe$3,
    (_, _1) => {
      let $ = value(drag_event);
      if ($ instanceof Some && $[0].droppable) {
        let event = $[0];
        event.drop(event);
        return on_drop(event, cleanup());
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
function add_drag(comp, value2, state) {
  let _pipe = comp;
  return ondrag(
    _pipe,
    (() => {
      let _pipe$1 = comp;
      return copy(_pipe$1);
    })(),
    value2,
    (e) => {
      let _pipe$1 = e.source;
      add_attribute(_pipe$1, hidden());
      return void 0;
    },
    (e, cleanup2) => {
      let _pipe$1 = e.source;
      remove_attribute(_pipe$1, hidden());
      return cleanup2();
    },
    (e) => {
      update(
        state,
        filter(value(state), (x) => {
          return x !== e.value;
        })
      );
      return void 0;
    }
  );
}
function add_drop(comp, state) {
  let _pipe = comp;
  return ondrop(
    _pipe,
    (_) => {
      return void 0;
    },
    (_) => {
      return true;
    },
    (e, cleanup2) => {
      update(state, prepend(e.value, value(state)));
      return cleanup2();
    }
  );
}
function panel1(state) {
  return hstack(
    new HCenter(),
    new EvenSpacing(),
    (hstack2) => {
      return render_children(
        state,
        hstack2,
        (letters) => {
          return map(
            letters,
            (letter) => {
              let comp = div(
                toList([class$("p-5 bg-blue-100 select-none")]),
                (_) => {
                  return toList([text(letter)]);
                }
              );
              let _pipe = comp;
              let _pipe$1 = add_drag(_pipe, letter, state);
              return add_drop(_pipe$1, state);
            }
          );
        }
      );
    }
  );
}
function panel2(state) {
  return hstack(
    new HCenter(),
    new EvenSpacing(),
    (hstack2) => {
      return render_children(
        state,
        hstack2,
        (letters) => {
          return map(
            letters,
            (letter) => {
              let _pipe = div(
                toList([class$("p-5 bg-green-100 select-none")]),
                (_) => {
                  return toList([text(letter)]);
                }
              );
              let _pipe$1 = add_drag(_pipe, letter, state);
              return add_drop(_pipe$1, state);
            }
          );
        }
      );
    }
  );
}
function main() {
  return start(
    () => {
      let state1 = create(toList(["A", "B", "C"]));
      let state2 = create(toList(["D", "E"]));
      return vstack(
        new VCenter(),
        new EvenSpacing(),
        (_) => {
          return toList([panel1(state1), panel2(state2)]);
        }
      );
    }
  );
}

// build/.lustre/entry.mjs
main();
