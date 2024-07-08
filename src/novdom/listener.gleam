import novdom/component.{type Component}

pub type Listener =
  #(String, fn(Event) -> Nil)

pub type Event

// TODO: Remove components attr from callbacks

pub fn onclick(
  component: Component,
  callback: fn(Component, Event) -> Nil,
) -> Component {
  component
  |> add_listener(#("click", callback(component, _)))
}

pub fn onmousemove(
  component: Component,
  callback: fn(Component, Event) -> Nil,
) -> Component {
  component
  |> add_listener(#("mousemove", callback(component, _)))
}

pub fn onemouseover(
  component: Component,
  callback: fn(Component, Event) -> Nil,
) -> Component {
  component |> add_listener(#("mouseover", callback(component, _)))
}

pub fn onmouseout(
  component: Component,
  callback: fn(Component, Event) -> Nil,
) -> Component {
  component |> add_listener(#("mouseout", callback(component, _)))
}

pub fn onmousedown(
  component: Component,
  callback: fn(Component, Event) -> Nil,
) -> Component {
  component |> add_listener(#("mousedown", callback(component, _)))
}

pub fn onmouseup(
  component: Component,
  callback: fn(Component, Event) -> Nil,
) -> Component {
  component |> add_listener(#("mouseup", callback(component, _)))
}

pub type MousePosition {
  MousePosition(
    x: Int,
    y: Int,
    osset_x: Int,
    offset_y: Int,
    // target: HTMLElement,
    screen_x: Int,
    screen_y: Int,
  )
}

@external(javascript, "../position_ffi.mjs", "get_mouse_pos")
pub fn get_mouse_position(event: Event) -> MousePosition

@external(javascript, "../document_ffi.mjs", "add_listener")
pub fn add_listener(comp: Component, listeners: Listener) -> Component
