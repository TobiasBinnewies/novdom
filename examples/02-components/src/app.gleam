import novdom/attribute.{class}
import novdom/component.{text}
import novdom/container.{
  AroundSpacing, Center, EvenSpacing, Gap, Right, Left, Top, hstack, vstack, zstack, vscroll
}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}

import novdom/state
import novdom/state_component.{utilize}

pub fn main() {
  use <- framework.start()

  let state = state.create("Hello, world!")

  // parent component
  // vstack(Center, Gap("1rem"), [
  //   // hstack(Top, EvenSpacing, [
  //   //   div([class("p-5 bg-blue-100 select-none")], [
  //   //     // simple text component
  //   //     text("Hello, world!"),
  //   //   ]),
  //   //   div([class("p-5 bg-blue-100 select-none")], [
  //   //     // simple text component
  //   //     text("Hello, world!"),
  //   //   ]),
  //   // ]),
  //   // hstack(Right, AroundSpacing, [
  //   //   div([class("p-5 bg-blue-100 select-none")], [
  //   //     // simple text component
  //   //     text("Hello, world!"),
  //   //   ]),
  //   //   div([class("p-5 bg-blue-100 select-none")], [
  //   //     // simple text component
  //   //     text("Hello, world!"),
  //   //   ]),
  //   // ]),
  //   div([class("p-5 bg-blue-100 select-none")], [
  //       // simple text component
  //       text("Hello, world!"),
  //     ]),
  // ])

  vscroll(Left, Gap("20px"), [
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
    div([class("p-5 bg-blue-100 select-none")], [
      // simple text component
      text("Hello, world!"),
    ]),
  ])

  // zstack(Right, [
  //   div([class("p-10 bg-green-100 select-none")], [
  //     // simple text component
  //     text("Hello, world!"),
  //   ]),
  //   div(
  //     [
  //       class("p-5 bg-blue-100 select-none"),
  //       onclick(fn(_) { state.update(state, "NEW") }),
  //     ],
  //     [
  //       // simple text component
  //       text("Hello, world!"),
  //     ],
  //   ),
  //   state_component.utilize(state, fn(value) { [text(value)] }),
  //   state_component.if1(state, fn(v) { v == "Hello, world!" }, [
  //     div([class("p-5 bg-red-100 select-none")], [
  //       // simple text component
  //       text("Hello, world!"),
  //     ]),
  //   ]),
  // ])
}
