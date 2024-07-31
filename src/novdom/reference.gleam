import novdom/component.{type Component}
import novdom/internals/parameter.{type Parameter, ComponentParameterList}
import novdom/internals/utils

pub type ReferenceType {
  Value
  InnerHTML
}

pub type Reference {
  Reference(id: String)
}

pub fn create() -> Reference {
  let id = utils.unique_id()
  Reference(id)
}

pub fn from_id(id: String) -> Reference {
  Reference(id)
}

pub fn set(ref: Reference, ref_type: ReferenceType) -> Parameter {
  use component <- ComponentParameterList
  add_reference(ref, component, ref_type)
  []
}

@external(javascript, "../document_ffi.mjs", "read_reference")
pub fn value(ref: Reference) -> String

@external(javascript, "../document_ffi.mjs", "add_reference")
fn add_reference(
  ref: Reference,
  component: Component,
  ref_type: ReferenceType,
) -> Nil
