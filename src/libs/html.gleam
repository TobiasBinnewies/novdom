import libs/attribute.{type Attribute}
import libs/component.{
  type Component, TextContainer, component, with_attributes, with_children,
}

const div_tag = "div"

const span_tag = "span"

// const input = "input"

const h1_tag = "h1"

const h2_tag = "h2"

const h3_tag = "h3"

pub fn div(attributes: List(Attribute), children: List(Component)) -> Component {
  component(div_tag)
  |> with_attributes(attributes)
  |> with_children(children)
}

pub fn span(attributes: List(Attribute), children: List(Component)) -> Component {
  component(span_tag)
  |> with_attributes(attributes)
  |> with_children(children)
}

// TODO: Add input (with attributes)
// pub fn input(attributes: List(Attribute), children: List(Component)) -> Component {
//   component(input)
//   |> with_children(children)
// }

pub fn h1(attributes: List(Attribute), children: List(Component)) -> Component {
  component(h1_tag)
  |> with_attributes(attributes)
  |> with_children(children)
}

pub fn h2(attributes: List(Attribute), children: List(Component)) -> Component {
  component(h2_tag)
  |> with_attributes(attributes)
  |> with_children(children)
}

pub fn h3(attributes: List(Attribute), children: List(Component)) -> Component {
  component(h3_tag)
  |> with_attributes(attributes)
  |> with_children(children)
}

pub fn text(value: String) -> Component {
  TextContainer(value)
}
