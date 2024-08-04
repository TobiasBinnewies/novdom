export function unique_id() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0)
}

export function current_date_string() {
  return new Date().toISOString()
}

export function set_timeout(fn, ms) {
  return setTimeout(fn, ms)
}