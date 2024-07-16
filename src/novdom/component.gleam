import gleam/function
import novdom/internals/utils

const text_tag = "_TEXT_"

const html_tag = "_HTML_"

pub type ComponentId =
  String

pub opaque type Component {
  Component(id: ComponentId, tag: String)
  // TextContainer(id: ComponentId, attributes: List(Attribute), value: String)
}

pub fn get_component(id: ComponentId) -> Component {
  Component(id, "")
}

pub fn component(
  tag: String,
  // attrs: List(Parameter),
  children: List(Component),
) -> Component {
  utils.unique_id()
  |> Component(tag)
  |> function.tap(create_element(_, children))
}

// TODO: Wrap text with <p> tag --> attributes possible (/ best practise?)
pub fn text(value) -> Component {
  Component(text_tag, value)
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

@external(javascript, "../document_ffi.mjs", "create_copy")
fn create_copy(comp: Component, id: String) -> Component

@external(javascript, "../document_ffi.mjs", "set_children")
pub fn set_children(comp: Component, children: List(Component)) -> Component

@external(javascript, "../document_ffi.mjs", "insert_child_at")
pub fn insert_child_at(comp: Component, child: Component, at: Int) -> Component

@external(javascript, "../document_ffi.mjs", "insert_child_before")
pub fn insert_child_before(
  comp: Component,
  child: Component,
  before_id: String,
) -> Component

@external(javascript, "../document_ffi.mjs", "remove_child_at")
pub fn remove_child_at(comp: Component, at: Int) -> Component

@external(javascript, "../document_ffi.mjs", "remove_child")
pub fn remove_child(comp: Component, child: Component) -> Component

@external(javascript, "../document_ffi.mjs", "move_children")
pub fn move_children(from: Component, to: Component) -> Nil
