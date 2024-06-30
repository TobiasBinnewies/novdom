import gleam/io
import gleam/list
import libs/attribute.{type Attribute, style}
import libs/component.{type Component, component, with_attributes, with_children}

const stack_tag = "_stack_"

const item_tag = "_item_"

const scroll_tag = "_scroll_"

pub type VAlignment {
  VLeft
  VRight
  VCenter
}

pub type HAlignment {
  HTop
  HBottom
  HCenter
}

pub type ZAlignment {
  ZTop
  ZBottom
  ZLeft
  ZRight
  ZCenter
  ZTopLeft
  ZTopRight
  ZBottomLeft
  ZBottomRight
}

pub type Spacing {
  Gap(String)
  NoSpacing
  EvenSpacing
  BetweenSpacing
  AroundSpacing
}

type Direction {
  VerticalDirection
  HorizontalDirection
}

pub type Scroll {
  VerticalScroll
  HorizontalScroll
  Scroll
  NoScroll
}

pub fn vstack(
  alignment: VAlignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    VLeft -> "flex-start"
    VRight -> "flex-end"
    VCenter -> "center"
  }
  stack(VerticalDirection, align, spacing, NoScroll, children)
}

pub fn vscroll(
  alignment: VAlignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    VLeft -> "flex-start"
    VRight -> "flex-end"
    VCenter -> "center"
  }
  stack(VerticalDirection, align, spacing, VerticalScroll, children)
}

pub fn hstack(
  alignment: HAlignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    HTop -> "flex-start"
    HBottom -> "flex-end"
    HCenter -> "center"
  }
  stack(HorizontalDirection, align, spacing, NoScroll, children)
}

pub fn hscroll(
  alignment: HAlignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    HTop -> "flex-start"
    HBottom -> "flex-end"
    HCenter -> "center"
  }
  stack(HorizontalDirection, align, spacing, HorizontalScroll, children)
}

pub fn zstack(alignment: ZAlignment, children: List(Component)) -> Component {
  let position = case alignment {
    ZTop -> [#("left", "50%"), #("transform", "translateX(-50%)")]
    ZBottom -> [
      #("left", "50%"),
      #("bottom", "0"),
      #("transform", "translateX(-50%)"),
    ]
    ZLeft -> [#("top", "50%"), #("transform", "translateY(-50%)")]
    ZRight -> [
      #("top", "50%"),
      #("right", "0"),
      #("transform", "translateY(-50%)"),
    ]
    ZCenter -> [
      #("top", "50%"),
      #("left", "50%"),
      #("transform", "translate(-50%, -50%)"),
    ]
    ZTopLeft -> []
    ZTopRight -> [#("right", "0")]
    ZBottomLeft -> [#("bottom", "0")]
    ZBottomRight -> [#("bottom", "0"), #("right", "0")]
  }

  let children =
    list.map(children, fn(c) {
      component(item_tag)
      |> with_attributes([
        style([
          #("position", "absolute"),
          #("min-width", "max-content"),
          #("min-height", "max-content"),
          #("overflow", "hidden"),
          ..position
        ]),
      ])
      |> with_children([c])
    })

  component(stack_tag)
  |> with_attributes([
    style([
      #("display", "block"),
      #("position", "relative"),
      #("height", "100%"),
      #("width", "100%"),
    ]),
  ])
  |> with_children(children)
}

fn stack(
  direction: Direction,
  align: String,
  spacing: Spacing,
  scrolling: Scroll,
  children: List(Component),
) -> Component {
  let spacing = case spacing {
    Gap(value) -> #("gap", value)
    NoSpacing -> #("gap", "0")
    EvenSpacing -> #("justify-content", "space-evenly")
    BetweenSpacing -> #("justify-content", "space-between")
    AroundSpacing -> #("justify-content", "space-around")
  }

  let direction = case direction {
    VerticalDirection -> "column"
    HorizontalDirection -> "row"
  }

  let overflow = case scrolling {
    VerticalScroll -> #("overflow-y", "auto")
    HorizontalScroll -> #("overflow-x", "auto")
    Scroll -> #("overflow", "auto")
    NoScroll -> #("overflow", "hidden")
  }

  component(stack_tag)
  |> with_attributes([
    style([
      #("height", "100%"),
      #("display", "flex"),
      #("flex-direction", direction),
      #("align-items", align),
      overflow,
      spacing,
    ]),
  ])
  |> with_children(children)
}
