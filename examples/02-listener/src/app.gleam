import gleam/int
import gleam/io
import novdom/attribute.{add_attribute, class, style}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}

pub fn main() {
  use <- framework.start()

  // parent component
  use _ <- div([class("p-5 bg-blue-100")])
  // child components
  [
    {
      use button <- div([class("p-2 bg-green-200 select-none")])

      // listener
      button
      |> onclick(fn(_, _) {
        io.println("Button clicked!")
        button
        |> add_attribute(style([#("background-color", random_color())]))
        Nil
      })

      // button children
      [text("Click me!")]
    },
  ]
}

fn random_color() -> String {
  let r = int.random(256)
  let g = int.random(256)
  let b = int.random(256)
  "rgb("
  <> int.to_string(r)
  <> ", "
  <> int.to_string(g)
  <> ", "
  <> int.to_string(b)
  <> ")"
}
