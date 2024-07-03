import gleam/list

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

