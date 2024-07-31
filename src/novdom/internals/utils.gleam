@external(javascript, "../../utils_ffi.mjs", "create_id")
pub fn unique_id() -> String

@external(javascript, "../../utils_ffi.mjs", "current_date_string")
pub fn current_date_string() -> String

@external(javascript, "../../utils_ffi.mjs", "set_timeout")
pub fn set_timeout(callback: fn() -> Nil, ms: Int) -> Nil

@external(javascript, "../../document_ffi.mjs", "set_last_value")
pub fn set_last_value(id: String, value: a) -> Nil

@external(javascript, "../../document_ffi.mjs", "get_last_value")
pub fn get_last_value(id: String) -> a
