import novdom/attribute.{style}
import novdom/component.{type Component, component}
import novdom/internals/parameter.{type Parameter, set_parameters}

const div_tag = "div"

const span_tag = "span"

// const input = "input"

const p_tag = "p"

const h1_tag = "h1"

const h2_tag = "h2"

const h3_tag = "h3"

pub fn div(parameters: List(Parameter), children: List(Component)) -> Component {
  component(div_tag, children)
  |> set_parameters(parameters)
}

pub fn span(parameters: List(Parameter), children: List(Component)) -> Component {
  component(span_tag, children)
  |> set_parameters(parameters)
}

// TODO: Add input (set parameters)
// pub fn input(parameters: List(Parameter), children: List(Component)) -> Component {
//   component(input)
// }

pub fn p(parameters: List(Parameter), children: List(Component)) -> Component {
  component(p_tag, children)
  |> set_parameters(parameters)
}

pub fn h1(parameters: List(Parameter), children: List(Component)) -> Component {
  component(h1_tag, children)
  |> set_parameters(parameters)
}

pub fn h2(parameters: List(Parameter), children: List(Component)) -> Component {
  component(h2_tag, children)
  |> set_parameters(parameters)
}

pub fn h3(parameters: List(Parameter), children: List(Component)) -> Component {
  component(h3_tag, children)
  |> set_parameters(parameters)
}

pub fn text(parameters: List(Parameter), value: String) -> Component {
  component.text(value)
  |> set_parameters(parameters)
}

pub fn textln(parameters: List(Parameter), value: String) -> Component {
  component.text(value)
  |> set_parameters([style([#("display", "block")]), ..parameters])
}
