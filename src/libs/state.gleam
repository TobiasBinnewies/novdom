import libs/component.{type Component, StateContainer, StatefulComponent}
// import libs/render.{type HTMLElement, get_element}
import libs/utils

pub type State(a) {
  State(id: String)
}

pub fn create(init: a) -> State(a) {
  let id = utils.unique_id()
  set_state(id, init)
  State(id)
}

// TODO: add check for id uniqueness
pub fn create_with_id(id: String, init: a) -> State(a) {
  set_state(id, init)
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

pub fn on_change(state: State(a), callback: fn(a) -> Nil) -> State(a) {
  add_state_listener(state.id, callback)
  state
}

// pub fn stateful_component(
//   state: State(a),
//   render: fn(a) -> Component,
// ) -> Component {
//   let id = utils.unique_id()
//   let render = fn(a) {
//     let comp = render(a)
//     get_element(comp)
//   }
//   add_stateful_component(id, render)
//   StatefulComponent(id, state.id)
// }

@external(javascript, "../document_ffi.mjs", "get_state")
fn get_state(key: String) -> a

@external(javascript, "../document_ffi.mjs", "set_state")
fn set_state(key: String, value: a) -> Nil

@external(javascript, "../document_ffi.mjs", "update_state")
fn update_state(key: String, value: a) -> Nil

// @external(javascript, "../document_ffi.mjs", "add_stateful_component")
// fn add_stateful_component(id: String, render: fn(a) -> HTMLElement) -> Nil

@external(javascript, "../document_ffi.mjs", "add_state_listener")
fn add_state_listener(key: String, callback: fn(a) -> Nil) -> Nil
