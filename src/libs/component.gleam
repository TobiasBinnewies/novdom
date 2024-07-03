import libs/utils

const text_tag = "_TEXT_"

pub type ComponentId =
  String

pub opaque type Component {
  Component(id: ComponentId, tag: String)
  // TextContainer(id: ComponentId, attributes: List(Attribute), value: String)
}

pub fn empty_component(tag: String) -> Component {
  let id = utils.unique_id()
  let comp = Component(id, tag)
  create_element(Component(id, tag))
  comp
}

pub fn component(
  tag: String,
  // attrs: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  let comp = empty_component(tag)
  let children = children(comp)
  set_children(comp, children)
  comp
}

pub fn text(value) -> Component {
  Component(text_tag, value)
}

pub fn copy(comp: Component) -> Component {
  let id = utils.unique_id()
  create_copy(comp, id)
}

@external(javascript, "../document_ffi.mjs", "get_element")
fn create_element(
  comp: Component,
  // attributes: List(Attribute),
  // children: List(HTMLElement),
  // listener: List(Listener),
) -> Nil

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
