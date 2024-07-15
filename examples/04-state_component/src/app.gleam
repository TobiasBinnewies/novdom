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
  use parent <- div([class("p-5")])
  [
    {
      use button <- div([
        class("p-2 bg-green-200 select-none"),
        onclick(fn(_) {
          io.println("Button clicked!")
          state.update(boolean, !state.value(boolean))
          state.update(counter, state.value(counter) + 1)
          Nil
        }),
      ])

      // button children
      [text("current value: " <> "nothind")]
    },
    {
      state_component.if1(boolean, fn(value) { value }, [
        {
          use button <- div([class("p-2 bg-green-200 select-none")])

          // button children
          [text("current value: " <> "nothind")]
        },
      ])
    },
    {
      state_component.ternary1(
        boolean,
        fn(value) { value },
        [
          {
            use button <- div([class("p-2 bg-yellow-200 select-none")])

            // button children
            [text("current value: " <> "nothind")]
          },
        ],
        [
          {
            use button <- div([class("p-2 bg-blue-200 select-none")])

            // button children
            [text("current value: " <> "nothind")]
          },
        ],
      )
    },
    {
      state_component.utilize(counter, fn(value) {
        [
          text("current value: " <> int.to_string(value))
        ]
      })
    }
  ]
}
