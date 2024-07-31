import novdom/component.{type Component}
import novdom/internals/parameter.{
  type Event, type Parameter, Modifier, Render, Unrender, set_parameters,
}
import novdom/internals/utils

pub type TriggerOption =
  parameter.TriggerOption

pub const onend = parameter.End

pub const onstart = parameter.Start

pub fn onrender(parameters: List(Parameter)) -> Parameter {
  use component <- Modifier
  Render(render_fn(component, parameters))
}

pub fn onunrender(
  parameters: List(Parameter),
  trigger: TriggerOption,
) -> Parameter {
  use component <- Modifier
  Unrender(render_fn(component, parameters), trigger)
}

fn render_fn(component: Component, parameters: List(Parameter)) -> fn() -> Nil {
  fn() {
    component
    |> set_parameters(parameters)
    Nil
  }
}
