import libs/component.{type Component}
import libs/motion
import libs/render

pub fn start(component: fn() -> Component) -> Nil {
  init_js()
  motion.init()
  component()
  |> render.add_to_viewport("_app_")
}

@external(javascript, "../document_ffi.mjs", "init")
fn init_js() -> Nil
