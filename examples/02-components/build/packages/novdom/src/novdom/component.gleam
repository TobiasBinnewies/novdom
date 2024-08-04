import gleam/function
import novdom/internals/utils

const text_tag = "p"

//"_TEXT_"

const html_tag = "_HTML_"

pub type ComponentId =
  String

pub opaque type Component {
  Component(id: ComponentId, tag: String)
  // TextContainer(id: ComponentId, attributes: List(Attribute), value: String)
}

// TODO: Remove this, add global listiner or something
pub fn document() -> Component {
  Component("document", "")
}

pub fn get_component(id: ComponentId) -> Component {
  Component(id, "")
}

pub fn component(tag: String, children: List(Component)) -> Component {
  utils.unique_id()
  |> Component(tag)
  |> function.tap(create_element(_, children))
}

/// gets wraped by a custom element tag (<_TEXT_>)
pub fn text(value) -> Component {
  utils.unique_id()
  |> Component(text_tag)
  |> function.tap(create_text_element(_, value))
}

/// gets wraped by a custom element tag (<_HTML_>)
pub fn html(value) -> Component {
  Component(html_tag, value)
}

pub fn copy(comp: Component) -> Component {
  let id = utils.unique_id()
  create_copy(comp, id)
}

@external(javascript, "../document_ffi.mjs", "get_element")
fn create_element(comp: Component, children: List(Component)) -> Nil

@external(javascript, "../document_ffi.mjs", "get_element")
fn create_text_element(comp: Component, text: String) -> Nil

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
