import gleam/list
import novdom/internals/parameter.{type Parameter, Attribute}

/// Adding classes to the component \
/// Concatenating the classes if the class attribute already exists
pub fn class(value: String) -> Parameter {
  Attribute("class", value)
}

/// Adding tailwind classes to the component \
/// Uses tailwind-merge to merge the classes if the class attribute already exists
pub fn tailwind(value: String) -> Parameter {
  Attribute("tailwind", value)
}

/// Adding inline-styles to the component \
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
