import libs/component.{type Component}
import libs/listener.{type Listener, type Event}

pub fn draggable(value: a, on_drag: fn() -> Nil, on_cancel: fn() -> Nil, child: Component, preview: Component) -> Component {
  todo
}

pub fn droppable(on_hover: fn(a) -> Bool, on_drop: fn(a) -> Nil) -> Component {
  todo
}
