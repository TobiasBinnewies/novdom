import {} from "./globals.mjs"

const TEXT = "_TEXT_"

// ------------------------------- VIEWPORT --------------------------------

export function init() {
  window.state_map = new Map()
  window.stateful_component_map = new Map()
  window.state_listener = new Map()
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

export function create_text_element(id, attributes, value) {
  const elem = document.createElement(TEXT)
  elem.innerText = value
  attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]))
  elem.setAttribute("id", id)
  return elem
}

export function get_element(comp) {
  if (comp.id === TEXT) {
    return comp.tag
  }
  const existing = document.getElementById(comp.id)
  if (existing) {
    return existing
  }
  const elem = document.createElement(comp.tag)
  elem.setAttribute("id", comp.id)
  // attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]))
  // children.toArray().forEach((child) => elem.appendChild(child))
  // listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]))
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

export function set_inner_text(comp, text) {
  const elem = get_element(comp)
  elem.innerText = text
  return comp
}

// ------------------------------- ATTRIBUTES --------------------------------

export function set_attributes(comp, attributes) {
  const elem = get_element(comp)
  // remove all attributes except id
  const keys = Object.keys(elem.attributes)
  keys.forEach((key) => {
    if (elem.attributes[key].name !== "id") {
      elem.removeAttribute(elem.attributes[key].name)
    }
  })
  attributes.toArray().forEach((attr) => add_attribute(comp, attr))
  return comp
}

export function add_attribute(comp, attribute) {
  const elem = get_element(comp)
  handle_attribute(elem, attribute[0], attribute[1], false)
  return comp
}

export function remove_attribute(comp, attribute) {
  const elem = get_element(comp)
  handle_attribute(elem, attribute[0], attribute[1], true)
  return comp
}

function handle_attribute(elem, key, value, remove) {
  if (value === "" || value.length === 0) {
    elem.removeAttribute(key)
    return
  }
  switch (key) {
    case "class":
      value.split(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls)
          return
        }
        elem.classList.add(cls)
      })
      return
    case "style":
      value.split(";").forEach((style) => {
        if (!style.includes(":")) {
          elem.style.setProperty(style, "")
          return
        }
        const split = style.split(":")
        if (remove) {
          elem.style.removeProperty(split[0])
          return
        }
        elem.style.setProperty(split[0], split[1].trim())
      })
      return
    case "hidden":
      if (remove) {
        elem.hidden = false
        return
      }
      elem.hidden = true
      return
    default:
      console.error("add_attribute: unknown attribute key / not implemented yet: " + key)
      return
  }
}

// ------------------------------- LISTENER --------------------------------

export function add_listener(comp, listener) {
  const elem = get_element(comp)
  elem.addEventListener(listener[0], listener[1])
  return comp
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

// ------------------------------- STATE --------------------------------

export function update_state(id, value) {
  ;(window.state_listener.get(id) || []).forEach((callback) => callback(value))
  set_state(id, value)
}

export function set_state(id, value) {
  window.state_map.set(id, value)
}

export function get_state(id) {
  return window.state_map.get(id)
}

export function add_stateful_component(id, render) {
  window.stateful_component_map.set(id, render)
}

export function get_stateful_component(id) {
  return window.stateful_component_map.get(id)
}

export function add_state_listener(id, callback) {
  let current = window.state_listener.get(id) || []
  window.state_listener.set(id, [callback, ...current])
}

// ------------------------------- OTHER --------------------------------
export class Ok {
  constructor(value) {
    this[0] = value
  }

  // @internal
  isOk() {
    return true
  }
}

export class Error {
  constructor(detail) {
    this[0] = detail
  }

  // @internal
  isOk() {
    return false
  }
}
