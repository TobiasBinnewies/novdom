import gleam/list
import libs/attribute.{type Attribute}
import libs/listener.{type Listener}
import libs/render.{type HTMLElement}
import libs/utils

pub type ComponentId =
  String

pub type Component {
  Component(
    id: ComponentId,
    tag: String,
    attributes: List(Attribute),
    children: List(Component),
    listeners: List(Listener),
  )
  TextContainer(id: ComponentId, attributes: List(Attribute), value: String)
  StateContainer(id: ComponentId, state_id: String)
  StatefulComponent(id: ComponentId, state_id: String)
}

pub fn create_component(
  tag: String,
  attrs: List(Attribute),
  children: fn(Component) -> List(Component),
) -> Component {
  let id = utils.unique_id()
  let comp = Component(id, tag, attrs, [], [])
  Component(id, tag, attrs, children(comp), [])
}

pub fn copy(comp: Component) -> Component {
  let id = utils.unique_id()
  case comp {
    Component(_, tag, attrs, children, listeners) -> {
      Component(id, tag, attrs, children, listeners)
    }
    TextContainer(_, attrs, value) -> {
      TextContainer(id, attrs, value)
    }
    StateContainer(_, state_id) -> {
      StateContainer(id, state_id)
    }
    StatefulComponent(_, state_id) -> {
      StatefulComponent(id, state_id)
    }
  }
}

pub fn component(tag: String) -> Component {
  let id = utils.unique_id()
  Component(id, tag, [], [], [])
}

pub fn set_attributes(component: Component, attrs: List(Attribute)) -> Component {
  case component {
    Component(id, tag, _, children, listener) -> {
      render.set_attributes(id, attrs)
      Component(id, tag, attrs, children, listener)
    }
    _ -> panic as "Only Component can have attributes"
  }
}

pub fn add_attribute(component: Component, attr: Attribute) -> Component {
  case component {
    Component(id, tag, current_attrs, children, listener) -> {
      render.add_attribute(id, attr)
      Component(id, tag, list.append(current_attrs, [attr]), children, listener)
    }
    _ -> panic as "Only Component can have attributes"
  }
}

/// Does not work for blueprints
pub fn remove_attribute(component: Component, attr: Attribute) -> Component {
  case component {
    Component(id, tag, current_attrs, children, listener) -> {
      render.remove_attribute(id, attr)
      Component(
        id,
        tag,
        list.filter(current_attrs, fn(a) { a != attr }),
        children,
        listener,
      )
    }
    _ -> panic as "Only Component can have attributes"
  }
}

pub fn add_listener(component: Component, listener: Listener) -> Component {
  case component {
    Component(id, tag, attributes, children, old_listener) -> {
      render.add_listeners(id, [listener])
      Component(id, tag, attributes, children, [listener, ..old_listener])
    }
    _ -> panic as "Only Component can have listeners"
  }
}

pub fn set_children(
  component: Component,
  children: List(Component),
) -> Component {
  case component {
    Component(id, tag, attributes, _, listener) -> {
      render.set_children(id, list.map(children, element))
      Component(id, tag, attributes, children, listener)
    }
    _ -> panic as "Only Component can have children"
  }
}

pub fn insert_child_at(
  component: Component,
  child: Component,
  at: Int,
) -> Component {
  case component {
    Component(id, tag, attributes, children, listener) -> {
      render.insert_child_at(id, element(child), at)
      let new =
        list.flatten([list.take(children, at), [child], list.drop(children, at)])
      Component(id, tag, attributes, new, listener)
    }
    _ -> panic as "Only Component can have children"
  }
}

pub fn insert_child_before(
  component: Component,
  child: Component,
  before: Component,
) -> Nil {
  render.insert_child_before(component.id, element(child), before.id)
  Nil
}

pub fn remove_child_at(component: Component, at: Int) -> Component {
  case component {
    Component(id, tag, attributes, children, listener) -> {
      render.remove_child_at(id, at)
      let new =
        list.flatten([list.take(children, at), list.drop(children, at + 1)])
      Component(id, tag, attributes, new, listener)
    }
    _ -> panic as "Only Component can have children"
  }
}

pub fn remove_child(component: Component, child: Component) -> Nil {
  render.remove_child(component.id, child.id)
  Nil
}

pub fn text(attributes: List(Attribute), value: String) -> Component {
  let id = utils.unique_id()
  TextContainer(id, attributes, value)
}

pub fn element(component: Component) -> HTMLElement {
  case component {
    Component(id, el, attributes, children, listener) -> {
      let children = list.map(children, element)
      let elem = render.create_element(id, el, attributes, children, listener)
      elem
    }
    TextContainer(id, attributes, value) -> {
      render.create_text_element(id, attributes, value)
    }
    StateContainer(id, state_id) -> {
      panic as "Do not use this!"
      // create_state_element(id, state_id)
    }
    StatefulComponent(id, state_id) -> {
      panic as "Do not use this!"
      // create_stateful_element(id, state_id)
    }
  }
}

pub fn start(component: Component) {
  let elem = element(component)
  render.add_to_viewport("#_app_", elem)
}
