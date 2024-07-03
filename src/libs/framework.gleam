import libs/motion

pub fn init() {
  init_js()
  motion.init()
}

@external(javascript, "../document_ffi.mjs", "init")
fn init_js() -> Nil
