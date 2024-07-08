import gleam/list
import novdom/component.{type Component}

pub type Attribute =
  #(String, String)

/// Adding classes to the component
/// Concatenating the classes if the class attribute already exists
pub fn class(value: String) -> Attribute {
  #("class", value)
}

// TODO: Tailwind, merge so that classes are overidden
// pub fn tailwind(value: String) -> Attribute {}

/// Adding inline-styles to the component
/// Overriding the style attribute if it already exists
pub fn style(values: List(#(String, String))) -> Attribute {
  let res = {
    use res, #(key, value) <- list.fold(values, "")
    case value {
      "" -> res <> key <> ";"
      _ -> res <> key <> ":" <> value <> ";"
    }
  }
  #("style", res)
}

pub fn hidden() -> Attribute {
  #("hidden", "hidden")
}

pub fn editable() -> Attribute {
  #("contenteditable", "true")
}

@external(javascript, "../document_ffi.mjs", "set_attributes")
pub fn set_attributes(comp: Component, attrs: List(Attribute)) -> Component

@external(javascript, "../document_ffi.mjs", "add_attribute")
pub fn add_attribute(comp: Component, attr: Attribute) -> Component

@external(javascript, "../document_ffi.mjs", "remove_attribute")
pub fn remove_attribute(comp: Component, attr: Attribute) -> Component
