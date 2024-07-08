import gleam/int
import gleam/io
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}
import novdom/state

pub fn main() {
  use <- framework.start()

  // state creation with initial value of 1
  let counter = state.create(1)

  // parent component
  use parent <- div([class("p-5 bg-blue-100")])
  // state value that updates on every change
  use value <- state.render_children(counter, parent)
  // child components
  [
    {
      use button <- div([class("p-2 bg-green-200 select-none")])

      // listener
      button
      |> onclick(fn(_, _) {
        io.println("Button clicked!")
        state.update(counter, value + 1)
        Nil
      })

      // button children
      [text("current value: " <> int.to_string(value))]
    },
  ]
}
