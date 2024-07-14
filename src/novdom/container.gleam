// import novdom/attribute.{set_attributes, style}
// import novdom/component.{type Component, component}

// const stack_tag = "_STACK_"

// // const item_tag = "_ITEM_"

// pub type VAlignment {
//   VLeft
//   VRight
//   VCenter
// }

// pub type HAlignment {
//   HTop
//   HBottom
//   HCenter
// }

// pub type ZAlignment {
//   ZTop
//   ZBottom
//   ZLeft
//   ZRight
//   ZCenter
//   ZTopLeft
//   ZTopRight
//   ZBottomLeft
//   ZBottomRight
// }

// pub type Spacing {
//   Gap(String)
//   NoSpacing
//   EvenSpacing
//   BetweenSpacing
//   AroundSpacing
// }

// type Direction {
//   VerticalDirection
//   HorizontalDirection
// }

// pub type Scroll {
//   VerticalScroll
//   HorizontalScroll
//   Scroll
//   NoScroll
// }

// pub fn vstack(
//   alignment: VAlignment,
//   spacing: Spacing,
//   children: fn(Component) -> List(Component),
// ) -> Component {
//   let align = case alignment {
//     VLeft -> "flex-start"
//     VRight -> "flex-end"
//     VCenter -> "center"
//   }
//   stack(VerticalDirection, align, spacing, NoScroll, children)
// }

// pub fn vscroll(
//   alignment: VAlignment,
//   spacing: Spacing,
//   children: fn(Component) -> List(Component),
// ) -> Component {
//   let align = case alignment {
//     VLeft -> "flex-start"
//     VRight -> "flex-end"
//     VCenter -> "center"
//   }
//   stack(VerticalDirection, align, spacing, VerticalScroll, children)
// }

// pub fn hstack(
//   alignment: HAlignment,
//   spacing: Spacing,
//   children: fn(Component) -> List(Component),
// ) -> Component {
//   let align = case alignment {
//     HTop -> "flex-start"
//     HBottom -> "flex-end"
//     HCenter -> "center"
//   }
//   stack(HorizontalDirection, align, spacing, NoScroll, children)
// }

// pub fn hscroll(
//   alignment: HAlignment,
//   spacing: Spacing,
//   children: fn(Component) -> List(Component),
// ) -> Component {
//   let align = case alignment {
//     HTop -> "flex-start"
//     HBottom -> "flex-end"
//     HCenter -> "center"
//   }
//   stack(HorizontalDirection, align, spacing, HorizontalScroll, children)
// }

// // TODO Implement zstack (this implementation does not work when children changes)
// // pub fn zstack(
// //   alignment: ZAlignment,
// //   children: fn(Component) -> List(Component),
// // ) -> Component {
// //   let position = case alignment {
// //     ZTop -> [#("left", "50%"), #("transform", "translateX(-50%)")]
// //     ZBottom -> [
// //       #("left", "50%"),
// //       #("bottom", "0"),
// //       #("transform", "translateX(-50%)"),
// //     ]
// //     ZLeft -> [#("top", "50%"), #("transform", "translateY(-50%)")]
// //     ZRight -> [
// //       #("top", "50%"),
// //       #("right", "0"),
// //       #("transform", "translateY(-50%)"),
// //     ]
// //     ZCenter -> [
// //       #("top", "50%"),
// //       #("left", "50%"),
// //       #("transform", "translate(-50%, -50%)"),
// //     ]
// //     ZTopLeft -> []
// //     ZTopRight -> [#("right", "0")]
// //     ZBottomLeft -> [#("bottom", "0")]
// //     ZBottomRight -> [#("bottom", "0"), #("right", "0")]
// //   }

// //   let stack =
// //     empty_component(stack_tag)
// //     |> set_attributes([
// //       style([
// //         #("display", "block"),
// //         #("position", "relative"),
// //         #("height", "100%"),
// //         #("width", "100%"),
// //       ]),
// //     ])

// //   let children =
// //     list.map(children(stack), fn(c) {
// //       empty_component(item_tag)
// //       |> set_attributes([
// //         style([
// //           #("position", "absolute"),
// //           #("min-width", "max-content"),
// //           #("min-height", "max-content"),
// //           #("overflow", "hidden"),
// //           ..position
// //         ]),
// //       ])
// //       |> set_children([c])
// //     })

// //   stack
// //   |> set_children(children)
// // }

// fn stack(
//   direction: Direction,
//   align: String,
//   spacing: Spacing,
//   scrolling: Scroll,
//   children: fn(Component) -> List(Component),
// ) -> Component {
//   let spacing = case spacing {
//     Gap(value) -> #("gap", value)
//     NoSpacing -> #("gap", "0")
//     EvenSpacing -> #("justify-content", "space-evenly")
//     BetweenSpacing -> #("justify-content", "space-between")
//     AroundSpacing -> #("justify-content", "space-around")
//   }

//   let direction = case direction {
//     VerticalDirection -> "column"
//     HorizontalDirection -> "row"
//   }

//   let overflow = case scrolling {
//     VerticalScroll -> #("overflow-y", "auto")
//     HorizontalScroll -> #("overflow-x", "auto")
//     Scroll -> #("overflow", "auto")
//     NoScroll -> #("overflow", "hidden")
//   }

//   component(stack_tag, children)
//   |> set_attributes([
//     style([
//       #("height", "100%"),
//       #("width", "100%"),
//       #("display", "flex"),
//       #("flex-direction", direction),
//       #("align-items", align),
//       overflow,
//       spacing,
//     ]),
//   ])
// }
