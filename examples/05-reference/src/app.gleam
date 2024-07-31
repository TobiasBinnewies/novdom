import gleam/int
import gleam/io
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}
import novdom/reference.{Value, InnerHTML}

pub fn main() {
  use <- framework.start()

  let ref = reference.create()

  // parent component
  div(
    [class("p-5 bg-blue-100"), reference.set(ref, InnerHTML)],
    // child components
    [
      // button
      div(
        [
          class("p-2 bg-green-200 select-none"),
          // listener
          onclick(fn(_) {
            io.println("Button clicked!")

            io.println(
              "Any javascript can be executed here: " <> random_color(),
            )

            io.println("REF: " <> reference.value(ref))
            Nil
          }),
        ],
        // button children
        [text("Click me!")],
      ),
    ],
  )
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
