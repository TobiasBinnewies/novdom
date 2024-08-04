import novdom/component.{type Component}

pub opaque type Callee {
  Callee(id: String)
}

/// Create a callee type that can be used to test if a function was called
pub fn create_callee() -> Callee {
  create_callee_js()
  |> Callee
}

/// Call a callee to later check if it was called (see `callee_count`).
/// Use this function to simulate a function call.
pub fn call_callee(callee: Callee) {
  call_callee_js(callee.id)
}

/// Check how often a callee was called
pub fn callee_count(callee: Callee) -> Int {
  callee_count_js(callee.id)
}

/// Check if a component is visible to the user
@external(javascript, "./testing_ffi.mjs", "component_in_document")
pub fn component_visible(component: Component) -> Bool

/// Trigger an event on a component.
///
/// Example to trigger a click event:
/// ```gleam
/// trigger_event(my_component, "click")
/// ```
///
@external(javascript, "./testing_ffi.mjs", "trigger_event")
pub fn trigger_event(component: Component, event: String) -> Nil

@external(javascript, "./testing_ffi.mjs", "create_callee")
fn create_callee_js() -> String

@external(javascript, "./testing_ffi.mjs", "call_callee")
fn call_callee_js(id: String) -> Nil

@external(javascript, "./testing_ffi.mjs", "callee_count")
fn callee_count_js(id: String) -> Int
