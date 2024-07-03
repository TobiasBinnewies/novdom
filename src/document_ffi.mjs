import {} from "./globals.mjs"

const TEXT = "_TEXT_"
// const STATE = "_STATE_"
// const STATEFUL = "_STATEFUL_"

// ------------------------------- VIEWPORT --------------------------------

export function init() {
  window.state_map = new Map()
  window.stateful_component_map = new Map()
  window.state_listener = new Map()
}

export function add_to_viewport(id, elem) {
  const viewport = document.querySelector(id)
  viewport.appendChild(elem)
}

export function clear_viewport(id) {
  const viewport = document.querySelector(id)
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

// export function create_state_element(id, state_id) {
//   const elem = document.createElement(STATE)
//   const value = get_state(state_id)
//   elem.setAttribute("class", state_id)
//   elem.setAttribute("id", id)
//   elem.innerText = value
//   return elem
// }

// export function create_stateful_element(id, state_id) {
//   const elem = document.createElement(STATEFUL)
//   const value = get_state(state_id)
//   const render = get_stateful_component(id)
//   elem.setAttribute("id", id)
//   elem.setAttribute("class", state_id)
//   elem.setAttribute("style", "height: 100%; width: 100%;")
//   elem.appendChild(render(value))
//   return elem
// }

export function create_element(id, tag, attributes, children, listeners) {
  const existing = document.getElementById(id)
  if (existing) return existing
  const elem = document.createElement(tag)
  elem.setAttribute("id", id)
  attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]))
  children.toArray().forEach((child) => elem.appendChild(child))
  listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]))
  return elem
}

// ------------------------------- ATTRIBUTES --------------------------------

export function set_attributes(comp_id, attributes) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("set_attributes: element not found: " + comp_id)
    return false
  }
  // remove all attributes except id
  const keys = Object.keys(elem.attributes)
  keys.forEach((key) => {
    if (elem.attributes[key].name !== "id") {
      elem.removeAttribute(elem.attributes[key].name)
    }
  })
  attributes.toArray().forEach((attr) => add_attribute(comp_id, attr))
  return true
}

export function add_attribute(comp_id, attribute) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("add_attribute: element not found: " + comp_id)
    return false
  }
  return handle_attribute(elem, attribute[0], attribute[1], false)
}

export function remove_attribute(comp_id, attribute) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("remove_attribute: element not found: " + comp_id)
    return false
  }
  return handle_attribute(elem, attribute[0], attribute[1], true)
}

function handle_attribute(elem, key, value, remove) {
  if (value === "" || value.length === 0) {
    elem.removeAttribute(key)
    return true
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
      return true
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
      return true
    case "hidden":
      if (remove) {
        elem.hidden = false
        return true
      }
      elem.hidden = true
      return true
    default:
      console.error("add_attribute: unknown attribute key / not implemented yet: " + key)
      return false
  }
}

// ------------------------------- LISTENER --------------------------------

export function add_listeners(comp_id, listeners) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("add_listeners: element not found: " + comp_id)
    return false
  }
  listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]))
  return true
}

// ------------------------------- CHILDREN --------------------------------

export function set_children(comp_id, children) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("set_children: element not found: " + comp_id)
    return false
  }
  elem.replaceChildren(children.toArray())
  return true
}

export function insert_child_at(comp_id, child, at) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("insert_child_at: element not found: " + comp_id)
    return false
  }
  if (elem.children.length <= at) {
    elem.appendChild(child)
    return true
  }
  elem.insertBefore(child, elem.children[at])
  return true
}

export function insert_child_before(comp_id, child, before_id) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("insert_child_before: element not found: " + comp_id)
    return false
  }
  const before_elem = elem.children[before_id]
  if (!before_elem) {
    console.error("insert_child_before: before element not found: " + before_id)
    return false
  }
  elem.insertBefore(child, before_elem)
  return true
}

export function remove_child_at(comp_id, at) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("remove_child_at: element not found: " + comp_id)
    return false
  }
  if (elem.children.length <= at) {
    console.error("remove_child_at: index out of bounds: " + at)
    return false
  }
  elem.removeChild(elem.children[at])
  return true
}

export function remove_child(comp_id, child_id) {
  const elem = document.getElementById(comp_id)
  if (!elem) {
    console.error("remove_child: element not found: " + comp_id)
    return false
  }
  const child = elem.children[child_id]
  if (!child) {
    console.error("remove_child: child not found: " + child_id)
    return false
  }
  elem.removeChild(child)
  return true
}

// ------------------------------- STATE --------------------------------

export function update_state(id, value) {
  ;(window.state_listener.get(id) || []).forEach((callback) => callback(value))
  // ;[].forEach.call(document.getElementsByClassName(id), (elem) => {
  //   if (elem.tagName === STATEFUL) {
  //     const new_elem = get_stateful_component(elem.id)(value)
  //     elem.replaceChildren(new_elem)
  //     return
  //   }
  //   if (elem.tagName === STATE) {
  //     elem.innerText = value
  //     return
  //   }
  // })
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
