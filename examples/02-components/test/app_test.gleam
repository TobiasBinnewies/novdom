import gleeunit
import gleeunit/should
import novdom/attribute.{class}
import novdom
import novdom/html.{div, text}
import novdom/listener.{onclick}
import novdom_testing as testing

pub fn main() {
  gleeunit.main()
}

pub fn component_test() {
  let button_callee = testing.create_callee()

  let button =
    div([onclick(fn(_) { button_callee |> testing.call_callee() })], [])

  {
    use <- novdom.start()

    div([class("p-5 bg-blue-100 select-none")], [
      text([], "Hello, world!"),
      button,
    ])
  }

  // callee abfragen: wurde gecalled?

  testing.trigger_event(button, "click")

  testing.callee_count(button_callee) |> should.equal(1)
}
