import gleam/list
import novdom/component.{type Component, get_component as get_comp}

pub type Event

pub type Parameter {
  Attribute(name: String, value: String)
  Listener(name: String, callback: fn(Event) -> Nil)

  /// *WARNING:* Cannot return modifier
  Modifier(name: String, callback: fn(fn() -> Nil) -> List(Parameter))

  ParameterContainer(id: String, List(Parameter))
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
      Modifier(name, callback) -> panic as "Implement add_modifier"
      ParameterContainer(id, params) -> {
        component
        |> add_component_id(id)
        |> set_parameters(params)
      }
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

pub fn get_component(param_id: String) -> Component {
  param_id
  |> get_component_id
  |> get_comp
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

@external(javascript, "../../document_ffi.mjs", "add_parameter")
fn add_component_id(comp: Component, id: String) -> Component

@external(javascript, "../../document_ffi.mjs", "get_component_id")
fn get_component_id(param_id: String) -> String
