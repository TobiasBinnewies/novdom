pub type Listener =
  #(String, fn(Event) -> Nil)

pub type Event

pub fn onclick(callback: fn(Event) -> Nil) -> Listener {
  #("click", callback)
}

pub fn onmousemove(callback: fn(Event) -> Nil) -> Listener {
  #("mousemove", callback)
}

pub fn onemouseover(callback: fn(Event) -> Nil) -> Listener {
  #("mouseover", callback)
}

pub fn onmouseout(callback: fn(Event) -> Nil) -> Listener {
  #("mouseout", callback)
}

pub fn onmousedown(callback: fn(Event) -> Nil) -> Listener {
  #("mousedown", callback)
}

pub fn onmouseup(callback: fn(Event) -> Nil) -> Listener {
  #("mouseup", callback)
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

@external(javascript, "../event_ffi.mjs", "get_mouse_pos")
pub fn get_mouse_position(event: Event) -> MousePosition
