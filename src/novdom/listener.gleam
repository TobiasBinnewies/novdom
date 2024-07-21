import novdom/internals/parameter.{type Event, type Parameter, Listener}

pub fn onclick(callback: fn(Event) -> Nil) -> Parameter {
  Listener("click", callback)
}

pub fn onmousemove(callback: fn(Event) -> Nil) -> Parameter {
  Listener("mousemove", callback)
}

pub fn onemouseover(callback: fn(Event) -> Nil) -> Parameter {
  Listener("mouseover", callback)
}

pub fn onmouseout(callback: fn(Event) -> Nil) -> Parameter {
  Listener("mouseout", callback)
}

pub fn onmousedown(callback: fn(Event) -> Nil) -> Parameter {
  Listener("mousedown", callback)
}

pub fn onmouseup(callback: fn(Event) -> Nil) -> Parameter {
  Listener("mouseup", callback)
}

pub fn onkeydown(callback: fn(Event) -> Nil) -> Parameter {
  Listener("keydown", callback)
}

/// Creates a listener that will only be called once
/// *WARNING:* If anything else than a Listener is passed, this function will panic
pub fn once(listener: Parameter) -> Parameter {
  case listener {
    Listener(event, callback) -> {
      Listener(event, create_once(callback))
    }
    _ -> panic as "Listener expected"
  }
}

// pub type MousePosition {
//   MousePosition(
//     x: Int,
//     y: Int,
//     osset_x: Int,
//     offset_y: Int,
//     // target: HTMLElement,
//     screen_x: Int,
//     screen_y: Int,
//   )
// }
// @external(javascript, "../position_ffi.mjs", "get_mouse_pos")
// pub fn get_mouse_position(event: Event) -> MousePosition

@external(javascript, "../document_ffi.mjs", "create_once")
pub fn create_once(callback: fn(Event) -> Nil) -> fn(Event) -> Nil
