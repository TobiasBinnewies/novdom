import novdom/component.{type Component}
import novdom/hotkey
import novdom/motion

// import novdom/motion
import novdom/render

pub fn start(component: fn() -> Component) -> Nil {
  init_js()
  motion.init()
  hotkey.init()
  component()
  |> render.add_to_viewport("_app_")
}

@external(javascript, "./document_ffi.mjs", "init")
fn init_js() -> Nil
