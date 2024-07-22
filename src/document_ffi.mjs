// import {} from "./globals.mjs"
import { List } from "../prelude.mjs"
import { Hotkey, Shift, Alt, Short } from "./novdom/hotkey.mjs"

const TEXT = "_TEXT_"
const HTML = "_HTML_"

String.prototype.smartSplit = function (separator) {
  return this.split(separator).filter((s) => s.length > 0)
}

Array.prototype.toList = function () {
  return List.fromArray(this)
}

// ------------------------------- VIEWPORT --------------------------------

export function init() {
  globalThis.state_map = new Map() // state_id: String => value: a
  globalThis.parameter_component_map = new Map() // param_id: String => component_id: String
  globalThis.state_parameter_last_value_map = new Map() // state_param_id: String => last_value: List(Parameter)
  globalThis.state_listener = new Map()

  globalThis.reference_map = new Map() // reference_id: String => type: String

  globalThis.hotkey_key_map = new Map() // key: Hotkey => ids: List(String)
  globalThis.hotkey_id_map = new Map() // id: String => keys: List(Hotkey)
  globalThis.hotkey_listener = new Map() // id: String => listener: Function
}

function add_to_unrendered(elem) {
  document.getElementById("_unrendered_").appendChild(elem)
}

export function add_to_viewport(comp, id) {
  const elem = get_element(comp)
  const viewport = document.getElementById(id)
  viewport.appendChild(elem)
}

export function clear_viewport(id) {
  const viewport = document.getElementById(id)
  viewport.replaceChildren()
}

// ------------------------------- ELEMENT --------------------------------

export function get_element(comp, children_comp) {
  if (comp.id === "document") {
    return document
  }
  if (comp.id === HTML) {
    const html = document.createElement(HTML)
    html.insertAdjacentHTML("beforeend", comp.tag)
    return html
  }
  const existing = document.getElementById(comp.id)
  if (existing) {
    return existing
  }
  const elem = document.createElement(comp.tag)
  elem.setAttribute("id", comp.id)

  try {
    const children = children_comp.toArray().map(get_element)
    elem.replaceChildren(...children)
  } catch (_) {
    // throws if children_comp is not a list, e.g. TEXT
    const text = document.createTextNode(children_comp.replace(" ", "\u00A0"))
    elem.replaceChildren(text)
  }
  add_to_unrendered(elem)
  return elem
}

export function create_copy(comp, new_id) {
  const elem = get_element(comp)
  const copy = elem.cloneNode(true)
  copy.setAttribute("id", new_id)
  add_to_unrendered(copy)
  return { id: new_id, tag: comp.tag }
}

// export function set_inner_text(comp, text) {
//   const elem = get_element(comp)
//   elem.innerText = text
//   return comp
// }

// ------------------------------- PARAMETER --------------------------------

export function add_parameter(comp, param_id) {
  globalThis.parameter_component_map.set(param_id, comp.id)
  return comp
}

export function get_component_id(id) {
  return globalThis.parameter_component_map.get(id)
}

// ------------------------------- ATTRIBUTES --------------------------------

// export function set_attributes(comp, attributes) {
//   const elem = get_element(comp)
//   // remove all attributes except id
//   const keys = Object.keys(elem.attributes)
//   keys.forEach((key) => {
//     if (elem.attributes[key].name !== "id") {
//       elem.removeAttribute(elem.attributes[key].name)
//     }
//   })
//   attributes.toArray().forEach((attr) => add_attribute(comp, attr))
//   return comp
// }

export function add_attribute(comp, name, value) {
  const elem = get_element(comp)
  handle_attribute(elem, name, value, false)
  return comp
}

export function remove_attribute(comp, name, value) {
  const elem = get_element(comp)
  handle_attribute(elem, name, value, true)
  return comp
}

// TODO: Remove hidden case
function handle_attribute(elem, name, value, remove) {
  if (value === "" || value.length === 0) {
    elem.removeAttribute(name)
    return
  }
  switch (name) {
    case "class":
      value.smartSplit(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls)
          return
        }
        elem.classList.add(cls)
      })
      return
    case "style":
      value.smartSplit(";").forEach((style) => {
        if (!style.includes(":")) {
          elem.style.setProperty(style, "")
          return
        }
        const split = style.smartSplit(":")
        if (remove) {
          elem.style.removeProperty(split[0])
          return
        }
        elem.style.setProperty(split[0], split[1].trim())
      })
      return
    default:
      if (remove) {
        elem.removeAttribute(name)
        return
      }
      elem.setAttribute(name, value)
      // console.error("add_attribute: unknown attribute name / not implemented yet: " + name)
      return
  }
}

// ------------------------------- LISTENER --------------------------------

export function add_listener(comp, name, callback) {
  const elem = get_element(comp)
  elem.addEventListener(name, callback)
  return comp
}

export function remove_listener(comp, name, callback) {
  const elem = get_element(comp)
  elem.removeEventListener(name, callback)
  return comp
}

export function create_once(callback) {
  const fn = (event) => {
    callback(event)
    event.target.removeEventListener(event.type, fn)
  }
  return fn
}

// ------------------------------- CHILDREN --------------------------------

export function set_children(comp, children_comp) {
  const elem = get_element(comp)
  const children = children_comp.toArray().map(get_element)
  elem.replaceChildren(...children)
  return comp
}

export function insert_child_at(comp, child_comp, at) {
  const elem = get_element(comp)
  const child = get_element(child_comp)
  if (elem.children.length <= at) {
    elem.appendChild(child)
    return comp
  }
  elem.insertBefore(child, elem.children[at])
  return comp
}

export function insert_child_before(comp, child_comp, before_id) {
  const elem = get_element(comp)
  const child = get_element(child_comp)
  const before_elem = elem.children[before_id]
  if (!before_elem) {
    console.error("insert_child_before: element not found: " + before_id)
    return comp
  }
  elem.insertBefore(child, before_elem)
  return comp
}

export function remove_child_at(comp, at) {
  const elem = get_element(comp)
  if (elem.children.length <= at) {
    console.error("remove_child_at: index out of bound: " + at)
    return comp
  }
  elem.removeChild(elem.children[at])
  return comp
}

export function remove_child(comp, child_comp) {
  const elem = get_element(comp)
  const child = elem.children[child_comp.id]
  if (!child) {
    console.error("remove_child: child not found: " + child_comp.id)
    return comp
  }
  elem.removeChild(child)
  return comp
}

export function move_children(from, to) {
  const from_elem = get_element(from)
  const to_elem = get_element(to)
  to_elem.replaceChildren(...from_elem.children)
}

// ------------------------------- STATE --------------------------------

export function update_state(id, value) {
  ;(globalThis.state_listener.get(id) || []).forEach((callback) => callback(value))
  set_state(id, value)
}

export function set_state(id, value) {
  globalThis.state_map.set(id, value)
}

export function get_state(id) {
  return globalThis.state_map.get(id)
}

export function add_stateful_component(id, render) {
  globalThis.stateful_component_map.set(id, render)
}

export function get_stateful_component(id) {
  return globalThis.stateful_component_map.get(id)
}

export function add_state_listener(id, callback) {
  let current = globalThis.state_listener.get(id) || []
  globalThis.state_listener.set(id, [callback, ...current])
}

export function set_last_state_parameter_value(id, value) {
  globalThis.state_parameter_last_value_map.set(id, value)
}

export function get_last_state_parameter_value(id) {
  return globalThis.state_parameter_last_value_map.get(id)
}

// ------------------------------- REFERENCE --------------------------------

export function add_reference(ref, type) {
  globalThis.reference_map.set(ref.id, type.constructor.name)
}

export function read_reference(ref) {
  const type = globalThis.reference_map.get(ref.id)
  const elem_id = globalThis.parameter_component_map.get(ref.id)
  const elem = document.getElementById(elem_id)
  if (type === "InnerHTML") {
    return elem.innerHTML
  }
  if (type === "Value") {
    if (elem.value !== undefined) {
      return elem.value
    }
    throw new Error("read_reference: value not found")
  }
}

// ------------------------------- HOTKEY --------------------------------

export function override_hotkey(id, key) {
  update_hotkey_map_remove(globalThis.hotkey_id_map.get(id) || [], id)
  const key_string = encode_key(key)
  globalThis.hotkey_id_map.set(id, [key_string])
  update_hotkey_map_add([key_string], id)
}

export function add_hotkey(id, key) {
  const current = globalThis.hotkey_id_map.get(id) || []
  const key_string = encode_key(key)
  globalThis.hotkey_id_map.set(id, [key_string, ...current])
  update_hotkey_map_add([key_string], id)
}

export function remove_hotkey(id, key) {
  const current = globalThis.hotkey_id_map.get(id) || []
  const key_string = encode_key(key)
  globalThis.hotkey_id_map.set(
    id,
    current.filter((k) => k !== key_string)
  )
  update_hotkey_map_remove([key_string], id)
}

function update_hotkey_map_add(hotkeys, id) {
  hotkeys.forEach((k) => {
    const current = globalThis.hotkey_key_map.get(k) || []
    globalThis.hotkey_key_map.set(k, [id, ...current])
  })
}

function update_hotkey_map_remove(hotkeys, id) {
  hotkeys.forEach((k) => {
    const current = globalThis.hotkey_key_map.get(k) || []
    globalThis.hotkey_key_map.set(
      k,
      current.filter((i) => i !== id)
    )
  })
}

export function get_hotkeys(id) {
  return (globalThis.hotkey_id_map.get(id) || []).map(decode_key).toList()
}

export function get_hotkey_ids(key) {
  const key_string = encode_key(key)
  return (globalThis.hotkey_key_map.get(key_string) || []).toList()
}

function encode_key(key) {
  let is_short = key.ctrlKey || key.metaKey
  let is_shift = key.shiftKey
  let is_alt = key.altKey
  if (key.modifiers) {
    const modifier_names = key.modifiers.toArray().map((m) => m.constructor.name)
    is_short = modifier_names.includes("Short")
    is_shift = modifier_names.includes("Shift")
    is_alt = modifier_names.includes("Alt")
  }
  return (
    key.code +
    ";" +
    (is_shift ? "Shift," : "") +
    (is_alt ? "Alt," : "") +
    (is_short ? "Short," : "")
  )
}

function decode_key(key_string) {
  const [keycode, modifier_string] = key_string.split(";")
  const modifiers = (
    modifier_string
      ? modifier_string.smartSplit(",").map((k) => {
          switch (k) {
            case "Shift":
              return new Shift()
            case "Alt":
              return new Alt()
            case "Short":
              return new Short()
            // case "meta":
            //   return new Meta()
            // case "ctrl":
            //   return new Ctrl()
            default:
              throw new Error("decode_key: unknown modifier: " + k)
          }
        })
      : []
  ).toList()
  return new Hotkey(keycode, modifiers)
}

export function keypress_callback(event) {
  const pressed_key = encode_key(event)
  const ids = globalThis.hotkey_key_map.get(pressed_key) || []
  if (ids.length === 0) {
    return
  }
  event.preventDefault()
  ids.forEach((id) => globalThis.hotkey_listener.get(id)(event))
}

export function set_hotkey_listener(id, listener) {
  globalThis.hotkey_listener.set(id, listener)
}

// ------------------------------- OTHER --------------------------------

export function store_mouse_position(e) {
  const drag = document.getElementById("_drag_")
  drag.style.setProperty("--mouse-x", e.clientX + "px")
  drag.style.setProperty("--mouse-y", e.clientY + "px")
}
