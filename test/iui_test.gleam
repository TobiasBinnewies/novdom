import gleeunit
import gleeunit/should
import libs/container.{vstack}

pub fn main() {
  gleeunit.main()
}

// pub fn framework_start_test() {
//   selector_in_document("#_app_") |> should.be_true

//   let component =
//     vstack(container.VCenter, container.EvenSpacing, [
//       div([], [text("Hello, world!")]),
//     ])

//   selector_in_document("#_app_") |> should.be_true
//   selector_in_document("_vstack_") |> should.be_true

//   framework.start(component)
// }

@external(javascript, "./test_ffi.mjs", "selector_in_document")
pub fn selector_in_document(selector: String) -> Bool
