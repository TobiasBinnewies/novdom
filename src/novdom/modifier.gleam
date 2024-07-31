import novdom/component.{type Component}
import novdom/internals/parameter.{
  type Event, type Parameter, Modifier, Render, Unrender, get_component,
  set_parameters,
}
import novdom/internals/utils

pub type TriggerOption =
  parameter.TriggerOption

pub const onend = parameter.End

pub const onstart = parameter.Start

pub fn onrender(parameters: List(Parameter)) -> Parameter {
  let id = utils.unique_id()
  Modifier(id, Render(render_fn(id, parameters)))
}

pub fn onunrender(
  parameters: List(Parameter),
  trigger: TriggerOption,
) -> Parameter {
  let id = utils.unique_id()
  Modifier(id, Unrender(render_fn(id, parameters), trigger))
}

fn render_fn(comp_id: String, parameters: List(Parameter)) -> fn() -> Nil {
  fn() {
    comp_id
    |> get_component()
    |> set_parameters(parameters)
    Nil
  }
}
