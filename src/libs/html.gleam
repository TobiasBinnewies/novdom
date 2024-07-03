import libs/attribute.{type Attribute}
import libs/component.{
  type Component, TextContainer, component, set_attributes, set_children,
}

const div_tag = "div"

const span_tag = "span"

// const input = "input"

const h1_tag = "h1"

const h2_tag = "h2"

const h3_tag = "h3"

pub fn div(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(div_tag)
  |> set_attributes(attributes)
  |> fn(c) { c |> set_children(children(c)) }
}

pub fn span(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(span_tag)
  |> set_attributes(attributes)
  |> fn(c) { c |> set_children(children(c)) }
}

// TODO: Add input (set attributes)
// pub fn input(attributes: List(Attribute), children: fn(Component) -> List(Component)) -> Component {
//   component(input)
//   |> fn(c) { c |> set_children(children(c)) }
// }

pub fn h1(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(h1_tag)
  |> set_attributes(attributes)
  |> fn(c) { c |> set_children(children(c)) }
}

pub fn h2(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(h2_tag)
  |> set_attributes(attributes)
  |> fn(c) { c |> set_children(children(c)) }
}

pub fn h3(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(h3_tag)
  |> set_attributes(attributes)
  |> fn(c) { c |> set_children(children(c)) }
}
