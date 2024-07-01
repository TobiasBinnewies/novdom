const TEXT = "_TEXT_"
const STATE = "_STATE_"
const STATEFUL = "_STATEFUL_"

window.state_map = new Map()
window.stateful_component_map = new Map()

export function create_text_element(value) {
  const elem = document.createElement(TEXT)
  elem.innerText = value
  return elem
}

export function create_state_element(state_id) {
  const elem = document.createElement(STATE)
  const value = get_state(state_id)
  elem.setAttribute("class", state_id)
  elem.innerText = value
  return elem
}

export function create_stateful_element(component_id, state_id, child) {
  const elem = document.createElement(STATEFUL)
  const value = get_state(state_id)
  const render = get_stateful_component(component_id)
  elem.setAttribute("id", component_id)
  elem.setAttribute("class", state_id)
  elem.setAttribute("style", "height: 100%; width: 100%;")
  elem.appendChild(render(value))
  return elem
}

export function create_element(tag, attributes, children, listeners) {
  const elem = document.createElement(tag)
  children.toArray().forEach((child) => elem.appendChild(child))
  attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]))
  if (listeners) {
    listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]))
  }
  return elem
}

export function add_to_viewport(id, elem) {
  const viewport = document.querySelector(id)
  viewport.appendChild(elem)
}

export function update_state(id, value) {
  const { to_string } = window.state_map.get(id)
  ;[].forEach.call(document.getElementsByClassName(id), (elem) => {
    if (elem.tagName === STATEFUL) {
      const new_elem = get_stateful_component(elem.id)(value)
      elem.replaceChildren(new_elem)
      return
    }
    if (elem.tagName === STATE) {
      elem.innerText = value
      return
    }
  })
  set_state(id, value, to_string)
}

export function set_state(id, value, to_string) {
  window.state_map.set(id, { value, to_string })
}

export function get_state(id) {
  return window.state_map.get(id).value
}

export function add_stateful_component(id, render) {
  window.stateful_component_map.set(id, render)
}

export function get_stateful_component(id) {
  return window.stateful_component_map.get(id)
}

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
