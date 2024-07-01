import gleam/int
import gleam/io
import libs/attribute.{class, style}
import libs/component.{type Component, with_listener}
import libs/container.{hstack, vscroll, vstack, zstack}
import libs/framework
import libs/html.{div, h1, span, text}

import gleam/list
import gleam/string
import libs/listener.{get_mouse_position, onclick, onmousemove}
import libs/state

pub fn main() {
  framework.init()
  let state1 = state.create(["A", "B", "C"], fn(a) { string.join(a, ", ") })
  let state2 = state.create(["D", "E"], fn(a) { string.join(a, ", ") })

  let component =
    vstack(container.VCenter, container.EvenSpacing, [
      panel1(state1),
      panel2(state2),
    ])

  framework.start(component)
}

fn panel1(state) -> Component {
  use letters <- state.stateful_component(state)
  hstack(
    container.HCenter,
    container.EvenSpacing,
    list.map(letters, fn(letter) {
      div([class("p-5 bg-blue-100")], [text(letter)])
    }),
  )
}

fn panel2(state) -> Component {
  use letters <- state.stateful_component(state)
  hstack(
    container.HCenter,
    container.EvenSpacing,
    list.map(letters, fn(letter) {
      div([class("p-5 bg-green-100")], [text(letter)])
    }),
  )
}
