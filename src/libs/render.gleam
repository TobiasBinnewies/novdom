import libs/attribute.{type Attribute}
import libs/listener.{type Listener}

pub type HTMLElement

@external(javascript, "../document_ffi.mjs", "add_to_viewport")
pub fn add_to_viewport(id: String, element: HTMLElement) -> Nil

@external(javascript, "../document_ffi.mjs", "clear_viewport")
pub fn clear_viewport(id: String) -> Nil

@external(javascript, "../document_ffi.mjs", "create_text_element")
pub fn create_text_element(
  id: String,
  attributes: List(Attribute),
  value: String,
) -> HTMLElement

// @external(javascript, "../document_ffi.mjs", "create_state_element")
// fn create_state_element(id: String, state_id: String) -> HTMLElement

// @external(javascript, "../document_ffi.mjs", "create_stateful_element")
// fn create_stateful_element(id: String, state_id: String) -> HTMLElement

@external(javascript, "../document_ffi.mjs", "create_element")
pub fn create_element(
  id: String,
  tag: String,
  attributes: List(Attribute),
  children: List(HTMLElement),
  listener: List(Listener),
) -> HTMLElement

@external(javascript, "../document_ffi.mjs", "set_attributes")
pub fn set_attributes(comp_id: String, attrs: List(Attribute)) -> Bool

@external(javascript, "../document_ffi.mjs", "add_attribute")
pub fn add_attribute(comp_id: String, attr: Attribute) -> Bool

@external(javascript, "../document_ffi.mjs", "remove_attribute")
pub fn remove_attribute(comp_id: String, attr: Attribute) -> Bool

@external(javascript, "../document_ffi.mjs", "add_listeners")
pub fn add_listeners(comp_id: String, listeners: List(Listener)) -> Bool

@external(javascript, "../document_ffi.mjs", "set_children")
pub fn set_children(comp_id: String, children: List(HTMLElement)) -> Bool

@external(javascript, "../document_ffi.mjs", "insert_child_at")
pub fn insert_child_at(comp_id: String, child: HTMLElement, at: Int) -> Bool

@external(javascript, "../document_ffi.mjs", "insert_child_before")
pub fn insert_child_before(
  comp_id: String,
  child: HTMLElement,
  before_id: String,
) -> Bool

@external(javascript, "../document_ffi.mjs", "remove_child_at")
pub fn remove_child_at(comp_id: String, at: Int) -> Bool

@external(javascript, "../document_ffi.mjs", "remove_child")
pub fn remove_child(comp_id: String, child_id: String) -> Bool
