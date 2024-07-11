@external(javascript, "../../utils_ffi.mjs", "create_id")
pub fn unique_id() -> String

@external(javascript, "../../utils_ffi.mjs", "current_date_string")
pub fn current_date_string() -> String

@external(javascript, "../../utils_ffi.mjs", "set_timeout")
pub fn set_timeout(callback: fn() -> Nil, ms: Int) -> Nil