import gleam/io
import gleam/option.{type Option, None, Some}
import libs/attribute.{add_attribute, style}
import libs/component.{type Component, copy, empty_component, set_children}
import libs/listener.{
  onemouseover, onmousedown, onmousemove, onmouseout, onmouseup,
}
import libs/render.{add_to_viewport, clear_viewport}
import libs/state.{type State}

const drag_event_id = "_DRAGGABLE_"

pub type DragEvent(a) {
  DragEvent(
    value: a,
    source: Component,
    preview: Component,
    drop: fn(DragEvent(a)) -> Nil,
    cancel: fn(DragEvent(a), fn() -> Nil) -> Nil,
    droppable: Bool,
  )
}

pub fn init() {
  let drag_event: State(Option(DragEvent(a))) =
    state.create_with_id(drag_event_id, None)
  add_mouse_up_listener(fn() {
    case state.value(drag_event) {
      Some(event) if !event.droppable -> event.cancel(event, cleanup())
      _ -> Nil
    }
  })
}

pub fn ondrag(
  comp: Component,
  preview: Component,
  value: a,
  on_drag: fn(DragEvent(a)) -> Nil,
  on_cancel: fn(DragEvent(a), fn() -> Nil) -> Nil,
  on_drop: fn(DragEvent(a)) -> Nil,
) -> Component {
  let drag_event = state.from_id(drag_event_id)

  let preview =
    empty_component(drag_event_id)
    |> add_attribute(
      style([
        #("position", "absolute"),
        // #("bottom", "calc(100vh - var(--mouse-y) - 10px)"),
        // #("right", "calc(100vw - var(--mouse-x) - 10px)"),
        #("top", "var(--mouse-y)"),
        #("left", "var(--mouse-x)"),
        #("min-width", "20px"),
        #("min-height", "20px"),
      ]),
    )
    |> set_children([preview])

  comp
  |> onmousedown(fn(_, _) {
    let event = DragEvent(value, comp, preview, on_drop, on_cancel, False)
    state.update(drag_event, Some(event))

    add_to_viewport(preview |> copy, "_drag_")
    on_drag(event)
  })
}

pub fn ondrop(
  comp: Component,
  on_drag: fn(DragEvent(a)) -> Nil,
  on_hover: fn(DragEvent(a)) -> Bool,
  on_drop: fn(DragEvent(a), fn() -> Nil) -> Nil,
) -> Component {
  let drag_event: State(Option(DragEvent(a))) = state.from_id(drag_event_id)

  drag_event
  |> state.on_change(fn(event) {
    case event {
      Some(event) if !event.droppable -> on_drag(event)
      _ -> Nil
    }
  })

  comp
  |> onemouseover(fn(_, _) {
    case state.value(drag_event) {
      Some(DragEvent(value, source, preview, cleanup, cancel, droppable)) -> {
        let event =
          DragEvent(value, source, preview, cleanup, cancel, droppable)
        state.update(
          drag_event,
          Some(DragEvent(
            value,
            source,
            preview,
            cleanup,
            cancel,
            on_hover(event),
          )),
        )
      }
      _ -> Nil
    }
  })
  |> onmouseout(fn(_, _) {
    case state.value(drag_event) {
      Some(event) -> {
        state.update(
          drag_event,
          Some(DragEvent(
            event.value,
            event.source,
            event.preview,
            event.drop,
            event.cancel,
            False,
          )),
        )
      }
      _ -> Nil
    }
  })
  |> onmouseup(fn(_, _) {
    case state.value(drag_event) {
      Some(event) if event.droppable -> {
        event.drop(event)
        on_drop(event, cleanup())
      }
      _ -> Nil
    }
  })
}

fn cleanup() -> fn() -> Nil {
  let state = state.from_id(drag_event_id)
  fn() {
    state.update(state, None)
    clear_viewport("_drag_")
  }
}

@external(javascript, "../motion_ffi.mjs", "add_mouse_up_listener")
pub fn add_mouse_up_listener(callback: fn() -> Nil) -> Nil
