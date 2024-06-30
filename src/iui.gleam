import gleam/io
import libs/attribute.{class, style}
import libs/component.{with_listener}
import libs/container.{zstack, vstack, hstack, vscroll}
import libs/framework
import libs/html.{div, h1, span, text}

import libs/listener.{onclick}
import libs/state

pub fn main() {
  let test_state = state.create_with_id("id123", "INIT", fn(a) { a })

  let component =
    // div([class("p-8 p-20 bg-primary m-5"), style([#("background", "red")])], [
    vscroll(container.VCenter, container.Gap("50px"), [
      div([class("bg-green-300 min-h-[500px]")], [text("Hello,  LAAAAAGNGE TTEXt!")]),
      h1([], [text("Hello, World!")]),
      h1([], [text("Hello, World!")]),
      h1([], [text("Hello, World!")]),
    ])
  // ])

  framework.start(component)
}
