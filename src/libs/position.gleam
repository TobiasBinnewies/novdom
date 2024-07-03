import gleam/int
import libs/attribute.{add_attribute, remove_attribute, style}
import libs/component.{type Component}

pub type ComponentRect {
  ComponentRect(x: Int, y: Int, width: Int, height: Int)
}

@external(javascript, "../position_ffi.mjs", "get_component_rect")
pub fn component_rect(comp: Component) -> ComponentRect

pub fn set(comp: Component, pos: ComponentRect) -> Nil {
  let own = component_rect(comp)

  let x = pos.x + { pos.width / 2 } - { own.width / 2 }
  let y = pos.y + { pos.height / 2 } - { own.height / 2 }

  comp
  |> remove_attribute(
    style([#("left", ""), #("top", ""), #("right", ""), #("bottom", "")]),
  )
  |> add_attribute(
    style([
      //   #("position", "absolute"),
      #("left", x |> int.to_string <> "px"),
      #("top", y |> int.to_string <> "px"),
    ]),
  )
  Nil
}

pub fn transform(comp: Component, pos: ComponentRect) -> Nil {
  let own = component_rect(comp)

  let x = pos.x + { pos.width / 2 } - own.x - { own.width / 2 }
  let y = pos.y + { pos.height / 2 } - own.y - { own.height / 2 }

  comp
  |> add_attribute(
    style([
      #(
        "transform",
        "translate("
          <> x |> int.to_string
          <> "px, "
          <> y |> int.to_string
          <> "px)",
      ),
    ]),
  )
  Nil
}
