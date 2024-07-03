import gleam/int
import gleam/io
import gleam/list
import gleam/string
import libs/attribute.{class, style}
import libs/component.{type Component, add_listener, start, text}
import libs/container.{hstack, vscroll, vstack, zstack}
import libs/framework
import libs/html.{div, h1, span}
import libs/listener.{get_mouse_position, onclick, onmousemove}
import libs/motion.{DragEvent}
import libs/position
import libs/state
import libs/utils

pub fn main() {
  framework.init()
  let state1 = state.create(["A", "B", "C"])
  let state2 = state.create(["D", "E"])

  let component = {
    use vstack <- vstack(container.VCenter, container.EvenSpacing)
    [
      panel1(state1),
      panel2(state2),
      {
        use div <- div([class("p-5 bg-blue-100")])
        [text([class("select-none")], "Click")]
      }
        |> add_listener(
          onclick(fn(_) {
            case state.value(state1) {
              ["A", ..] -> {
                state.update(state1, ["B"])
                vstack
                |> component.add_attribute(
                  style([#("background-color", "red")]),
                )
                Nil
              }
              _ -> {
                state.update(state1, ["A", "B", "C"])
                vstack
                |> component.remove_attribute(style([#("background", "")]))
                Nil
              }
            }
          }),
        ),
    ]
  }

  start(component)
}

fn panel1(state) -> Component {
  // use letters <- state.stateful_component(state)
  let letters = state.value(state)

  use hstack <- hstack(container.HCenter, container.EvenSpacing)
  list.map(letters, fn(letter) {
    let comp = {
      use div <- div([class("p-5 bg-blue-100")])
      [text([class("select-none")], letter)]
    }

    comp
    |> add_drag(letter, hstack)
    |> add_drop(hstack)
  })
}

fn panel2(state) -> Component {
  // use letters <- state.stateful_component(state)
  let letters = state.value(state)

  use hstack <- hstack(container.HCenter, container.EvenSpacing)
  list.map(letters, fn(letter) {
    {
      use div <- div([class("p-5 bg-green-100")])
      [text([class("select-none")], letter)]
    }
    |> add_drag(letter, hstack)
    |> add_drop(hstack)
  })
}

fn add_drag(comp: Component, value: String, parent: Component) -> Component {
  comp
  |> motion.ondrag(
    comp |> component.copy(),
    value,
    fn(e) {
      e.source |> component.add_attribute(attribute.hidden())
      Nil
    },
    fn(e, cleanup) {
      e.source |> component.remove_attribute(attribute.hidden())
      cleanup()
    },
    fn(e) {
      io.debug("REMOVING CHILD")
      component.remove_child(parent, e.source)
    },
  )
}

fn add_drop(comp: Component, parent: Component) -> Component {
  comp
  |> motion.ondrop(fn(_) { Nil }, fn(_) { True }, fn(e, cleanup) {
    let new =
      {
        use div <- div([class("p-5 bg-red-100")])
        [text([class("select-none")], e.value)]
      }
      |> add_drag(e.value, parent)
      |> add_drop(parent)
    // e.source |> component.remove_attribute(attribute.hidden())
    component.insert_child_at(parent, new, 0)
    cleanup()
  })
}
