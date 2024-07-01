import gleam/list
import libs/attribute.{type Attribute}
import libs/component.{
  type Component, Component, StateContainer, StatefulComponent, TextContainer,
}
import libs/listener.{type Listener}

pub type HTMLElement

pub fn start(component: Component) {
  let element = get_element(component)
  add_to_viewport("#app", element)
}

pub fn get_element(component: Component) -> HTMLElement {
  case component {
    Component(el, attributes, children, listener) -> {
      let children = list.map(children, get_element)
      create_element(el, attributes, children, listener)
    }
    TextContainer(value) -> {
      create_text_element(value)
    }
    StateContainer(state_id) -> {
      create_state_element(state_id)
    }
    StatefulComponent(state_id, component_id) -> {
      create_stateful_element(component_id, state_id)
    }
  }
}

@external(javascript, "../document_ffi.mjs", "init")
pub fn init() -> Nil

@external(javascript, "../document_ffi.mjs", "create_text_element")
fn create_text_element(value: String) -> HTMLElement

@external(javascript, "../document_ffi.mjs", "create_state_element")
fn create_state_element(state_id: String) -> HTMLElement

@external(javascript, "../document_ffi.mjs", "create_stateful_element")
fn create_stateful_element(
  component_id: String,
  state_id: String,
) -> HTMLElement

@external(javascript, "../document_ffi.mjs", "create_element")
fn create_element(
  tag: String,
  attributes: List(Attribute),
  children: List(HTMLElement),
  listener: List(Listener),
) -> HTMLElement

@external(javascript, "../document_ffi.mjs", "add_to_viewport")
fn add_to_viewport(id: String, element: HTMLElement) -> Nil
