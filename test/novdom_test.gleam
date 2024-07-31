import gleeunit
import gleeunit/should
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/html.{div}
import novdom/listener.{onclick}

pub fn main() {
  gleeunit.main()
}

pub fn framework_start_test() {
  selector_in_document("#_app_") |> should.be_true

  const button = div([
    onclick(fn(_) {
      // callee erstellen
    })
  ], [])

  {
    use <- framework.start()

    div([class("p-5 bg-blue-100 select-none")], [text("Hello, world!")])
  }

  // callee abfragen: wurde gecalled?

  selector_in_document("#_app_") |> should.be_true
  selector_in_document("div") |> should.be_true
}

/// Checks if the selector is in the document.
/// Also adds the global window and document object to the context.
@external(javascript, "./test_ffi.mjs", "selector_in_document")
pub fn selector_in_document(selector: String) -> Bool

// add component in document --> check auf visibility
// abfrage von parameter --> was ist genau applied

// triggern von listener callbacks + hotkeys

// können transitions iwie getestet werden??
