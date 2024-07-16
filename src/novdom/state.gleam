import novdom/component.{type Component, set_children}
import novdom/internals/utils

pub type State(a) {
  State(state_id: String)
  StateItem(state_id: String, item_id: String)
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
  get_state(state.state_id)
}

/// update value
pub fn update(state: State(a), new: a) -> Nil {
  update_state(state.state_id, new)
}

pub fn listen(state: State(a), callback: fn(a) -> Nil) -> Nil {
  add_state_listener(state.state_id, callback)
}

@external(javascript, "../document_ffi.mjs", "get_state")
fn get_state(key: String) -> a

@external(javascript, "../document_ffi.mjs", "set_state")
fn set_state(key: String, value: a) -> Nil

@external(javascript, "../document_ffi.mjs", "update_state")
fn update_state(key: String, value: a) -> Nil

@external(javascript, "../document_ffi.mjs", "add_state_listener")
fn add_state_listener(key: String, callback: fn(a) -> Nil) -> Nil
