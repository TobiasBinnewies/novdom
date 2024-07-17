import gleam/option.{type Option, None, Some}
import novdom/attribute.{style}
import novdom/component.{
  type Component, component, copy, document, drag_component, set_children,
}
import novdom/internals/parameter.{
  type Event, type Parameter, ParameterContainer, get_component, set_parameters,
}
import novdom/internals/utils
import novdom/listener.{
  onemouseover, onmousedown, onmousemove, onmouseout, onmouseup,
}
import novdom/render.{add_to_viewport, clear_viewport}
import novdom/state.{type State}
import novdom/state_component

const drag_event_id = "_DRAGGABLE_"

pub type DragEvent(a) {
  DragEvent(
    value: a,
    // source: Component,
    preview: Component,
    drop: fn(DragEvent(a)) -> Nil,
    cancel: fn(DragEvent(a), fn() -> Nil) -> Nil,
    droppable: Bool,
  )
}

pub type PreviewType {
  Preview(Component)
  Self
}

// TODO: Move the event listener from index.html to here
// TODO: Move init away from framework.start()
pub fn init() {
  let drag_event: State(Option(DragEvent(a))) =
    state.create_with_id(drag_event_id, None)

  document()
  |> set_parameters([
    onmouseup(fn(_) {
      case state.value(drag_event) {
        Some(event) if !event.droppable -> event.cancel(event, cleanup())
        _ -> Nil
      }
    }),
    onmousemove(fn(e) { store_mouse_position(e) }),
  ])

  drag_component()
  |> set_children([
    state_component.utilize(drag_event, fn(event) {
      case event {
        Some(event) -> [event.preview]
        None -> []
      }
    }),
  ])
}

pub fn ondrag(
  preview_type: PreviewType,
  value: a,
  on_drag: fn(DragEvent(a)) -> Nil,
  on_cancel: fn(DragEvent(a), fn() -> Nil) -> Nil,
  on_drop: fn(DragEvent(a)) -> Nil,
) -> Parameter {
  let drag_event = state.from_id(drag_event_id)

  let drag_id = utils.unique_id()

  ParameterContainer(drag_id, [
    onmousedown(fn(_) {
      let preview =
        case preview_type {
          Preview(preview) -> [preview |> copy()]
          Self -> [drag_id |> get_component |> copy]
        }
        |> component(drag_event_id, _)
        |> set_parameters([
          style([
            #("position", "absolute"),
            // #("bottom", "calc(100vh - var(--mouse-y) - 10px)"),
            // #("right", "calc(100vw - var(--mouse-x) - 10px)"),
            #("top", "var(--mouse-y)"),
            #("left", "var(--mouse-x)"),
            #("min-width", "20px"),
            #("min-height", "20px"),
          ]),
        ])

      let event = DragEvent(value, preview, on_drop, on_cancel, False)
      state.update(drag_event, Some(event))

      on_drag(event)
    }),
  ])
}

pub fn ondrop(
  on_drag: fn(DragEvent(a)) -> Nil,
  on_hover: fn(DragEvent(a)) -> Bool,
  on_drop: fn(DragEvent(a), fn() -> Nil) -> Nil,
) -> Parameter {
  let drag_event: State(Option(DragEvent(a))) = state.from_id(drag_event_id)

  drag_event
  |> state.listen(fn(event) {
    case event {
      Some(event) if !event.droppable -> on_drag(event)
      _ -> Nil
    }
  })

  ParameterContainer("", [
    onemouseover(fn(_) {
      case state.value(drag_event) {
        Some(DragEvent(value, preview, cleanup, cancel, droppable)) -> {
          let event = DragEvent(value, preview, cleanup, cancel, droppable)
          state.update(
            drag_event,
            Some(DragEvent(value, preview, cleanup, cancel, on_hover(event))),
          )
        }
        _ -> Nil
      }
    }),
    onmouseout(fn(_) {
      case state.value(drag_event) {
        Some(event) -> {
          state.update(
            drag_event,
            Some(DragEvent(
              event.value,
              event.preview,
              event.drop,
              event.cancel,
              False,
            )),
          )
        }
        _ -> Nil
      }
    }),
    onmouseup(fn(_) {
      case state.value(drag_event) {
        Some(event) if event.droppable -> {
          event.drop(event)
          on_drop(event, cleanup())
        }
        _ -> Nil
      }
    }),
  ])
}

fn cleanup() -> fn() -> Nil {
  let state = state.from_id(drag_event_id)
  fn() { state.update(state, None) }
}

@external(javascript, "../document_ffi.mjs", "store_mouse_position")
pub fn store_mouse_position(event: Event) -> Nil
