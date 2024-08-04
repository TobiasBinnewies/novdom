import novdom/internals/utils

pub type HTMLElement {
  HTMLElement
}

pub type ComponentId =
  String

pub type Component {
  Component(id: ComponentId, element: HTMLElement)
}

pub fn copy(comp: Component) -> Component {
  let id = utils.unique_id()
  create_copy(comp, id)
}

@external(javascript, "../document_ffi.mjs", "create_element")
pub fn component(tag: String, children: List(Component)) -> Component

/// gets wraped by a custom element tag (<_TEXT_>)
@external(javascript, "../document_ffi.mjs", "create_text_element")
pub fn text(text: String) -> Component

@external(javascript, "../document_ffi.mjs", "create_copy")
fn create_copy(comp: Component, id: String) -> Component

@external(javascript, "../document_ffi.mjs", "set_child")
pub fn set_child(comp: Component, children: Component) -> Component
// @external(javascript, "../document_ffi.mjs", "insert_child_at")
// pub fn insert_child_at(comp: Component, child: Component, at: Int) -> Component

// @external(javascript, "../document_ffi.mjs", "insert_child_before")
// pub fn insert_child_before(
//   comp: Component,
//   child: Component,
//   before_id: String,
// ) -> Component

// @external(javascript, "../document_ffi.mjs", "remove_child_at")
// pub fn remove_child_at(comp: Component, at: Int) -> Component

// @external(javascript, "../document_ffi.mjs", "remove_child")
// pub fn remove_child(comp: Component, child: Component) -> Component

// @external(javascript, "../document_ffi.mjs", "move_children")
// pub fn move_children(from: Component, to: Component) -> Nil
