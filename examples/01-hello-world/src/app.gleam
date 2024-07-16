import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}

pub fn main() {
  use <- framework.start()

  // parent component
  div(
    [class("p-5 bg-blue-100 select-none")],
    // child components
    [
      // simple text component
      text("Hello, world!"),
    ],
  )
}
