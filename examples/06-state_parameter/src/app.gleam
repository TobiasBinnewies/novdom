import gleam/int
import gleam/io
import novdom
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/html.{div}
import novdom/listener.{onclick}
import novdom/state
import novdom/state_parameter

pub fn main() {
  use <- novdom.start()

  // state creation with initial value of 1

  let boolean = state.create(False)
  let boolean2 = state.create(False)

  // parent component
  div(
    [
      class("p-5"),
      state_parameter.if1(boolean, fn(value) { value }, [class("rounded-3xl")]),
      state_parameter.if2(
        boolean,
        boolean2,
        fn(value1, value2) { value1 && value2 },
        [class("scale-150")],
      ),
      state_parameter.ternary1(
        boolean,
        fn(value) { value },
        [class("bg-red-100")],
        [class("bg-blue-100")],
      ),
      state_parameter.utilize(boolean, fn(value) {
        case value {
          True -> [class("text-black")]
          False -> [class("text-white")]
        }
      }),
    ],
    // state value that updates on every change
    // use value <- state.render_children(boolean, parent)
    // child components
    [
      div(
        [
          class("p-2 bg-green-200 select-none"),
          onclick(fn(_) {
            io.println("Button clicked!")
            state.update(boolean, !state.value(boolean))
            Nil
          }),
        ],
        // button children
        [text("current value: " <> "nothind")],
      ),
      div(
        [
          class("p-2 bg-yellow-200 select-none"),
          onclick(fn(_) {
            io.println("Button2 clicked!")
            state.update(boolean2, !state.value(boolean2))
            Nil
          }),
        ],
        // button children
        [text("current value: " <> "nothind")],
      ),
    ],
  )
}
