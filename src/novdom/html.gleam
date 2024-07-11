import novdom/attribute.{type Attribute, set_attributes}
import novdom/component.{type Component, component}

const div_tag = "div"

const span_tag = "span"

// const input = "input"

const p_tag = "p"

const h1_tag = "h1"

const h2_tag = "h2"

const h3_tag = "h3"

pub fn div(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(div_tag, children)
  |> set_attributes(attributes)
}

pub fn span(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(span_tag, children)
  |> set_attributes(attributes)
}

// TODO: Add input (set attributes)
// pub fn input(attributes: List(Attribute), children: fn(Component) -> List(Component)) -> Component {
//   component(input)
// }

pub fn p(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(p_tag, children)
  |> set_attributes(attributes)
}

pub fn h1(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(h1_tag, children)
  |> set_attributes(attributes)
}

pub fn h2(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(h2_tag, children)
  |> set_attributes(attributes)
}

pub fn h3(
  attributes: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  component(h3_tag, children)
  |> set_attributes(attributes)
}