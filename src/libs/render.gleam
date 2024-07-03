import libs/component.{type Component}

@external(javascript, "../document_ffi.mjs", "add_to_viewport")
pub fn add_to_viewport(comp: Component, id: String) -> Nil

@external(javascript, "../document_ffi.mjs", "clear_viewport")
pub fn clear_viewport(id: String) -> Nil
