import gleam/list
import novdom/component.{type Component}

pub type Event

pub type TriggerOption {
  Start
  End
}

pub type ModifierStore {
  Render(fn() -> Nil)
  Unrender(fn() -> Nil, TriggerOption)
}

pub type Parameter {
  Attribute(name: String, value: String)
  Listener(name: String, callback: fn(Event) -> Nil)

  /// *WARNING:* Cannot return modifier
  Modifier(fn(Component) -> ModifierStore)

  ParameterList(List(Parameter))

  ComponentParameterList(fn(Component) -> List(Parameter))
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
      ParameterList(params) -> set_parameters(component, params)
      ComponentParameterList(f) -> set_parameters(component, f(component))
      Modifier(f) ->
        case f(component) {
          Render(render_fn) -> {
            component
            // |> add_component_id(id)
            |> add_render(render_fn)
          }
          Unrender(render_fn, trigger) -> {
            component
            // |> add_component_id(id)
            |> add_unrender(render_fn, trigger)
          }
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

@external(javascript, "../../document_ffi.mjs", "add_render")
fn add_render(comp: Component, callback: fn() -> Nil) -> Component

@external(javascript, "../../document_ffi.mjs", "add_unrender")
fn add_unrender(
  comp: Component,
  callback: fn() -> Nil,
  trigger: TriggerOption,
) -> Component
