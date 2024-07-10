import gleam/io
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}

pub fn main() {
  use <- framework.start()

  // parent component
  use parent <- div([class("p-5 bg-blue-100 select-none")])
  // child components
  parent
  |> onclick(fn(_, _) {
    io.debug("Clicked!")
    Nil
  })
  [
    text("Hello, world!"),
    // simple text component
  ]
}
