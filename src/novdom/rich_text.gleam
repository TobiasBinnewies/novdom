import novdom/attribute.{editable}
import novdom/component.{type Component, component}
import novdom/html.{div, p}
import novdom/internals/parameter
import novdom/internals/utils
import novdom/reference.{type Reference, InnerHTML}

pub type Quill

pub type Delta

pub opaque type RichTextStore {
  RichTextStore(quill: Quill, component: Component)
}

pub type Format {
  Bold
  Italic
  Underline
}

pub fn store() -> RichTextStore {
  let comp = component("div", [])
  let quill = init_quill(comp)
  RichTextStore(quill, comp)
}

pub fn editor(store: RichTextStore) -> Component {
  store.component
}

@external(javascript, "../quill_ffi.mjs", "init")
fn init_quill(comp: Component) -> Quill

@external(javascript, "../quill_ffi.mjs", "get_delta")
pub fn delta(store: RichTextStore) -> Delta

@external(javascript, "../quill_ffi.mjs", "get_text")
pub fn text(store: RichTextStore) -> String

@external(javascript, "../quill_ffi.mjs", "format")
pub fn format(store: RichTextStore, format: Format) -> Delta
