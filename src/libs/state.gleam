import libs/component.{type Component, StateContainer, StatefulComponent}
import libs/framework.{type HTMLElement}
import libs/utils

pub opaque type State(a) {
  State(id: String)
}

pub fn create(init: a, to_string: fn(a) -> String) -> State(a) {
  let id = utils.create_id()
  set_state(id, init, to_string)
  State(id)
}

// TODO: add check for id uniqueness
pub fn create_with_id(
  id: String,
  init: a,
  to_string: fn(a) -> String,
) -> State(a) {
  set_state(id, init, to_string)
  State(id)
}

pub fn from_id(id: String) -> State(a) {
  State(id)
}

/// get value
pub fn value(state: State(a)) -> a {
  get_state(state.id)
}

/// update value
pub fn update(state: State(a), new: a) -> Nil {
  update_state(state.id, new)
}

/// get state component
pub fn component(state: State(a)) -> Component {
  StateContainer(state.id)
}

pub fn stateful_component(
  state: State(a),
  render: fn(a) -> Component,
) -> Component {
  let id = utils.create_id()
  let render = fn(a) {
    let comp = render(a)
    framework.get_element(comp)
  }
  add_stateful_component(id, render)
  StatefulComponent(state.id, id)
}

@external(javascript, "../document_ffi.mjs", "get_state")
fn get_state(key: String) -> a

@external(javascript, "../document_ffi.mjs", "set_state")
fn set_state(key: String, value: a, to_string: fn(a) -> String) -> Nil

@external(javascript, "../document_ffi.mjs", "update_state")
fn update_state(key: String, value: a) -> Nil

@external(javascript, "../document_ffi.mjs", "add_stateful_component")
fn add_stateful_component(id: String, render: fn(a) -> HTMLElement) -> Nil
