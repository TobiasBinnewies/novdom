import gleam/list
import novdom/component.{type Component}
import novdom/internals/parameter.{type Event, set_parameters}
import novdom/internals/utils
import novdom/listener.{global_listener, onkeydown}

pub type Modifier {
  Shift
  Alt
  Short
  //   Control
  //   Meta
}

pub type Hotkey {
  Hotkey(code: String, modifiers: List(Modifier))
}

pub type HotkeyId =
  String

pub type HotkeyOption {
  Key(Hotkey)
  Id(HotkeyId)
}

pub fn init() -> Nil {
  global_listener(onkeydown(keypress_callback))
}

pub fn configure_ids(config: List(#(HotkeyId, List(Hotkey)))) -> Nil {
  use #(id, keys) <- list.each(config)
  use key <- list.each(keys)
  add(id, key)
}

// TODO: Change to |> with_hotkey(..)? 
pub fn with_hotkey(
  option: HotkeyOption,
  callback: fn(Event) -> Nil,
) -> fn(Event) -> Nil {
  let id = case option {
    Key(hotkey) -> {
      let id = utils.unique_id()
      add(id, hotkey)
      id
    }
    Id(id) -> id
  }

  set_hotkey_listener(id, callback)

  callback
}

@external(javascript, "../document_ffi.mjs", "get_hotkeys")
pub fn get_keys(id: HotkeyId) -> List(Hotkey)

@external(javascript, "../document_ffi.mjs", "get_hotkey_ids")
pub fn get_ids(key: Hotkey) -> List(HotkeyId)

@external(javascript, "../document_ffi.mjs", "override_hotkey")
pub fn override(id: HotkeyId, key: Hotkey) -> Nil

@external(javascript, "../document_ffi.mjs", "add_hotkey")
pub fn add(id: HotkeyId, key: Hotkey) -> Nil

@external(javascript, "../document_ffi.mjs", "remove_hotkey")
pub fn remove(id: HotkeyId, key: Hotkey) -> Nil

@external(javascript, "../document_ffi.mjs", "keypress_callback")
pub fn keypress_callback(e: Event) -> Nil

@external(javascript, "../document_ffi.mjs", "set_hotkey_listener")
pub fn set_hotkey_listener(id: HotkeyId, callback: fn(Event) -> Nil) -> Nil
// pub type Key {
//     Q
//     W
//     E
//     R
//     T
//     Y
//     U
//     I
//     O
//     P
//     A
//     S
//     D
//     F
//     G
//     H
//     J
//     K
//     L
//     Z
//     X
//     C
//     V
//     B
//     N
//     M
//     T1
//     T2
//     T3
//     T4
//     T5
//     T6
//     T7
//     T8
//     T9
//     T0
// }
