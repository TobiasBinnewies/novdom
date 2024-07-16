import gleam/int
import gleam/io
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}
import novdom/state
import novdom/state_component

pub fn main() {
  use <- framework.start()

  // state creation with initial value of 1

  let boolean = state.create(True)
  let counter = state.create(1)

  // parent component
  div([class("p-5")], [
    div(
      [
        class("p-2 bg-green-200 select-none hover:bg-violet-600 active:bg-yellow-700"),
        onclick(fn(_) {
          io.println("Button clicked!")
          state.update(boolean, !state.value(boolean))
          state.update(counter, state.value(counter) + 1)
          Nil
        }),
      ],
      // button children
      [text("current value: " <> "nothind")],
    ),
    state_component.if1(boolean, fn(value) { value }, [
      text("current value: " <> "nothind"),
    ]),
    state_component.ternary1(
      boolean,
      fn(value) { value },
      [
        div(
          [class("p-2 bg-yellow-200 select-none")],
          // button children
          [text("current value: " <> "nothind"), text("current value: " <> "nothind"), text("current value: " <> "nothind")],
        ),
      ],
      [
        div(
          [class("p-2 bg-blue-200 select-none")],
          // button children
          [text("current value: " <> "nothind")],
        ),
      ],
    ),
    state_component.utilize(counter, fn(value) {
      [text("current value: " <> int.to_string(value))]
    }),
  ])
}
