import gleam/list
import libs/attribute.{type Attribute}
import libs/listener.{type Listener}

pub type Component {
  Component(
    tag: String,
    attributes: List(Attribute),
    children: List(Component),
    listeners: List(Listener),
  )
  TextContainer(value: String)
  StateContainer(state_id: String)
  StatefulComponent(state_id: String, component_id: String)
}

pub fn create_component(
  tag: String,
  attrs: List(Attribute),
  children: List(Component),
) -> Component {
  Component(tag, attrs, children, [])
}

pub fn component(tag: String) -> Component {
  Component(tag, [], [], [])
}

pub fn with_attributes(component: Component, attr: List(Attribute)) -> Component {
  case component {
    Component(tag, current_attrs, children, listener) -> {
      Component(tag, list.append(current_attrs, attr), children, listener)
    }
    _ -> panic as "Only Component can have attributes"
  }
}

pub fn with_listener(component: Component, listener: Listener) -> Component {
  case component {
    Component(tag, attributes, children, old_listener) -> {
      Component(tag, attributes, children, [listener, ..old_listener])
    }
    _ -> panic as "Only Component can have listeners"
  }
}

pub fn with_children(
  component: Component,
  children: List(Component),
) -> Component {
  case component {
    Component(tag, attributes, _, listener) -> {
      Component(tag, attributes, children, listener)
    }
    _ -> panic as "Only Component can have children"
  }
}
