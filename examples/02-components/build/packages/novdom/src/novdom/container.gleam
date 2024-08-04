import gleam/list
import novdom/attribute.{style}
import novdom/component.{type Component}
import novdom/html.{div}

const stack_tag = "_STACK_"

// const item_tag = "_ITEM_"

pub type Alignment {
  Top
  Bottom
  Left
  Right
  Center
  TopLeft
  TopRight
  BottomLeft
  BottomRight
}

pub type Spacing {
  Gap(String)
  NoSpacing
  EvenSpacing
  BetweenSpacing
  AroundSpacing
}

pub type Direction {
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
  alignment: Alignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    Left -> "flex-start"
    Right -> "flex-end"
    _ -> "center"
  }
  stack(VerticalDirection, alignment, spacing, NoScroll, children)
}

pub fn vscroll(
  alignment: Alignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    Left -> "flex-start"
    Right -> "flex-end"
    _ -> "center"
  }
  stack(VerticalDirection, alignment, spacing, VerticalScroll, children)
}

pub fn hstack(
  alignment: Alignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  let align = case alignment {
    Top -> "flex-start"
    Bottom -> "flex-end"
    _ -> "center"
  }
  stack(HorizontalDirection, alignment, spacing, NoScroll, children)
}

pub fn hscroll(
  alignment: Alignment,
  spacing: Spacing,
  children: List(Component),
) -> Component {
  stack(HorizontalDirection, alignment, spacing, HorizontalScroll, children)
}

// TODO Implement zstack (this implementation does not work when children changes)
pub fn zstack(alignment: Alignment, children: List(Component)) -> Component {
  let position = case alignment {
    Top -> [#("left", "50%"), #("transform", "translateX(-50%)")]
    Bottom -> [
      #("left", "50%"),
      #("bottom", "0"),
      #("transform", "translateX(-50%)"),
    ]
    Left -> [#("top", "50%"), #("transform", "translateY(-50%)")]
    Right -> [
      #("top", "50%"),
      #("right", "0"),
      #("transform", "translateY(-50%)"),
    ]
    Center -> [
      #("top", "50%"),
      #("left", "50%"),
      #("transform", "translate(-50%, -50%)"),
    ]
    TopLeft -> []
    TopRight -> [#("right", "0")]
    BottomLeft -> [#("bottom", "0")]
    BottomRight -> [#("bottom", "0"), #("right", "0")]
  }

  // TODO: Apply attributes directly to children?
  let children =
    list.map(children, fn(c) {
      div(
        [
          style([
            #("position", "absolute"),
            #("min-width", "max-content"),
            #("min-height", "max-content"),
            #("overflow", "hidden"),
            ..position
          ]),
        ],
        [c],
      )
    })

  div(
    [
      style([
        #("display", "block"),
        #("position", "relative"),
        #("height", "100%"),
        #("width", "100%"),
      ]),
    ],
    children,
  )
}

pub fn stack(
  direction: Direction,
  alignment: Alignment,
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

  let #(direction, align) = case direction {
    VerticalDirection -> #("column", {
      case alignment {
        Left -> "flex-start"
        Right -> "flex-end"
        _ -> "center"
      }
    })
    HorizontalDirection -> #("row", {
      case alignment {
        Top -> "flex-start"
        Bottom -> "flex-end"
        _ -> "center"
      }
    })
  }

  let overflow = case scrolling {
    VerticalScroll -> #("overflow-y", "auto")
    HorizontalScroll -> #("overflow-x", "auto")
    Scroll -> #("overflow", "auto")
    NoScroll -> #("overflow", "hidden")
  }

  let align =
    div(
      [
        style([
          #("height", "100%"),
          #("width", "100%"),
          #("display", "flex"),
          #("flex-direction", direction),
          #("align-items", align),
          overflow,
          spacing,
        ]),
      ],
      children,
    )
}
