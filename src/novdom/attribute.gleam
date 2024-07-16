import gleam/list
import novdom/internals/parameter.{type Parameter, Attribute}

/// Adding classes to the component
/// Concatenating the classes if the class attribute already exists
pub fn class(value: String) -> Parameter {
  Attribute("class", value)
}

// TODO: Tailwind, merge so that classes are overidden
// pub fn tailwind(value: String) -> Parameter {}

/// Adding inline-styles to the component
/// Overriding the style attribute if it already exists
pub fn style(values: List(#(String, String))) -> Parameter {
  let res = {
    use res, #(key, value) <- list.fold(values, "")
    case value {
      "" -> res <> key <> ";"
      _ -> res <> key <> ":" <> value <> ";"
    }
  }
  Attribute("style", res)
}

pub fn hidden() -> Parameter {
  Attribute("hidden", "hidden")
}

pub fn editable() -> Parameter {
  Attribute("contenteditable", "true")
}