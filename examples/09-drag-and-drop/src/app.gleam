import gleam/io
import gleam/list
import novdom/attribute.{class, hidden}
import novdom/component.{type Component, text}

// import novdom/container.{hstack, vstack}
import novdom
import novdom/html.{div}
import novdom/motion.{Preview, Self, ondrag, ondrop}
import novdom/state.{type State}

pub fn main() {
  use <- novdom.start()

  // let state1 = state.create(["A", "B", "C"])
  // let state2 = state.create(["D", "E"])

  div([], [
    div(
      [
        class("p-5 bg-blue-100 select-none"),
        ondrag(
          Self,
          "A",
          fn(e) {
            io.debug("drag start")
            Nil
          },
          fn(e, cleanup) {
            io.debug("drag end")
            cleanup()
          },
          fn(e) {
            io.debug("drag drop")
            Nil
          },
        ),
      ],
      [text("Hello, world!")],
    ),
    div(
      [
        class("p-5 bg-red-100 select-none"),
        ondrag(
          Preview(div([class("h-8 w-8 bg-red-400")], [])),
          "A",
          fn(e) {
            io.debug("drag start")
            Nil
          },
          fn(e, cleanup) {
            io.debug("drag end")
            cleanup()
          },
          fn(e) {
            io.debug("drag drop")
            Nil
          },
        ),
      ],
      [text("Hello, world!")],
    ),
    div(
      [
        class("p-5 bg-green-100 select-none"),
        ondrag(
          Preview(div([class("h-8 w-8 bg-green-400")], [])),
          "A",
          fn(e) {
            io.debug("drag start")
            Nil
          },
          fn(e, cleanup) {
            io.debug("drag end")
            cleanup()
          },
          fn(e) {
            io.debug("drag drop failed")
            Nil
          },
        ),
      ],
      [text("Hello, world!")],
    ),
    div(
      [
        class("p-5 bg-yellow-100 select-none"),
        ondrop(
          fn(e) {
            io.debug("drag over")
            Nil
          },
          fn(e) {
            io.debug("drag hover")
            True
          },
          fn(e, cleanup) {
            io.debug("drag drop success")
            cleanup()
          },
        ),
      ],
      [text("DROP")],
    ),
  ])
}
// fn panel1(state) -> Component {
//   use hstack <- hstack(container.HCenter, container.EvenSpacing)
//   use letters <- state.render_children(state, hstack)
//   list.map(letters, fn(letter) {
//     let comp = {
//       use _ <- div([class("p-5 bg-blue-100 select-none")])
//       [text(letter)]
//     }

//     comp
//     |> add_drag(letter, state)
//     |> add_drop(state)
//   })
// }

// fn panel2(state) -> Component {
//   use hstack <- hstack(container.HCenter, container.EvenSpacing)
//   use letters <- state.render_children(state, hstack)
//   list.map(letters, fn(letter) {
//     {
//       use _ <- div([class("p-5 bg-green-100 select-none")])
//       [text(letter)]
//     }
//     |> add_drag(letter, state)
//     |> add_drop(state)
//   })
// }

// fn add_drag(
//   comp: Component,
//   value: String,
//   state: State(List(String)),
// ) -> Component {
//   comp
//   |> motion.ondrag(
//     comp |> component.copy(),
//     value,
//     fn(e) {
//       e.source |> add_attribute(hidden())
//       Nil
//     },
//     fn(e, cleanup) {
//       e.source |> remove_attribute(hidden())
//       cleanup()
//     },
//     fn(e) {
//       state.update(
//         state,
//         list.filter(state.value(state), fn(x) { x != e.value }),
//       )
//       Nil
//     },
//   )
// }

// fn add_drop(comp: Component, state: State(List(String))) -> Component {
//   comp
//   |> motion.ondrop(fn(_) { Nil }, fn(_) { True }, fn(e, cleanup) {
//     // let new =
//     //   {
//     //     use div <- div([class("p-5 bg-red-100")])
//     //     [text(e.value)]
//     //   }
//     //   |> add_drag(e.value, state, parent)
//     //   |> add_drop(state, parent)
//     // component.insert_child_at(parent, new, 0)
//     state.update(state, [e.value, ..state.value(state)])
//     cleanup()
//   })
// }
