pub type Listener = #(String, fn(Event) -> Nil)

pub type Event

pub fn onclick(callback: fn(Event) -> Nil) -> Listener {
  #("click", callback)
}
