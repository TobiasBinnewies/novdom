import gleam/list
import novdom/component.{type Component}

pub type Event

pub type Parameter {
  Attribute(name: String, value: String)
  Listener(name: String, callback: fn(Event) -> Nil)

  /// *WARNING:* Cannot return modifier
  Modifier(name: String, callback: fn(fn() -> Nil) -> List(Parameter))
  StateParameter(id: String, initial: List(Parameter))

  ParameterContainer(List(Parameter))
}

pub fn set_parameters(
  component: Component,
  params: List(Parameter),
) -> Component {
  {
    use param <- list.each(params)

    case param {
      Attribute(key, value) -> add_attribute(component, key, value)
      Listener(name, callback) -> add_listener(component, name, callback)
      Modifier(name, callback) -> todo as "Implement add_modifier"
      StateParameter(id, initial) -> {
        component
        |> add_state_parameter(id)
        |> set_parameters(initial)
      }
      ParameterContainer(params) -> set_parameters(component, params)
    }
  }
  component
}

pub fn remove_parameters(
  component: Component,
  params: List(Parameter),
) -> Component {
  {
    use param <- list.each(params)

    case param {
      Attribute(key, value) -> remove_attribute(component, key, value)
      Listener(name, callback) -> remove_listener(component, name, callback)
      _ -> panic as "Can only remove attributes and listeners"
    }
  }
  component
}

@external(javascript, "../../document_ffi.mjs", "add_attribute")
pub fn add_attribute(comp: Component, name: String, value: String) -> Component

@external(javascript, "../../document_ffi.mjs", "remove_attribute")
pub fn remove_attribute(
  comp: Component,
  name: String,
  value: String,
) -> Component

@external(javascript, "../../document_ffi.mjs", "add_listener")
pub fn add_listener(
  comp: Component,
  name: String,
  callback: fn(Event) -> Nil,
) -> Component

@external(javascript, "../../document_ffi.mjs", "remove_listener")
pub fn remove_listener(
  comp: Component,
  name: String,
  callback: fn(Event) -> Nil,
) -> Component

@external(javascript, "../../document_ffi.mjs", "add_state_parameter")
pub fn add_state_parameter(comp: Component, id: String) -> Component
