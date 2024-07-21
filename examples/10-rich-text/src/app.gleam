import gleam/io
import novdom/attribute.{class}
import novdom/component.{text}
import novdom/framework
import novdom/hotkey.{Alt, Hotkey, Id, Shift, Short, with_hotkey}
import novdom/html.{div}
import novdom/listener.{onclick, onkeydown}
import novdom/rich_text

pub fn main() {
  use <- framework.start()

  hotkey.configure_ids([
    #("bold", [
      Hotkey("KeyB", [Short]),
      Hotkey("KeyB", [Short, Shift]),
      Hotkey("KeyB", [Short, Alt]),
    ]),
    #("italic", [Hotkey("KeyI", [Short]), Hotkey("KeyB", [Short, Alt])]),
    #("underline", [Hotkey("KeyU", [Short])]),
  ])

  let store = rich_text.store()

  // parent component
  div(
    [class("p-5 bg-blue-100")],
    // child components
    [
      // simple text component
      rich_text.editor(store),
      div(
        [
          class("p-5 bg-blue-100 select-none"),
          onclick(
            with_hotkey(Id("bold"), fn(_) {
              rich_text.format(store, rich_text.Bold)
              Nil
            }),
          ),
          onkeydown(fn(_) { io.println("keydown") }),
        ],
        [text("Bold")],
      ),
      div(
        [
          class("p-5 bg-blue-100 select-none"),
          onclick(
            with_hotkey(Id("italic"), fn(_) {
              rich_text.format(store, rich_text.Italic)
              Nil
            }),
          ),
          onkeydown(fn(_) { io.println("keydown") }),
        ],
        [text("Italic")],
      ),
    ],
  )
}
