import * as $option from "../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../gleam_stdlib/gleam/option.mjs";
import { store_mouse_position } from "../document_ffi.mjs";
import { toList, CustomType as $CustomType } from "../gleam.mjs";
import * as $attribute from "../novdom/attribute.mjs";
import { style } from "../novdom/attribute.mjs";
import * as $component from "../novdom/component.mjs";
import { component, copy } from "../novdom/component.mjs";
import * as $html from "../novdom/html.mjs";
import { div } from "../novdom/html.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { ComponentParameterList, ParameterList, set_parameters } from "../novdom/internals/parameter.mjs";
import * as $listener from "../novdom/listener.mjs";
import {
  global_listener,
  onemouseover,
  onmousedown,
  onmousemove,
  onmouseout,
  onmouseup,
} from "../novdom/listener.mjs";
import * as $render from "../novdom/render.mjs";
import * as $state from "../novdom/state.mjs";
import * as $state_component from "../novdom/state_component.mjs";

export { store_mouse_position };

export class DragEvent extends $CustomType {
  constructor(value, preview, drop, cancel, droppable) {
    super();
    this.value = value;
    this.preview = preview;
    this.drop = drop;
    this.cancel = cancel;
    this.droppable = droppable;
  }
}

export class Preview extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Self extends $CustomType {}

const drag_event_id = "_DRAGGABLE_";

export function ondrag(preview_type, value, on_drag, on_cancel, on_drop) {
  let drag_event = $state.from_id(drag_event_id);
  return new ComponentParameterList(
    (self) => {
      let preview_comp = (() => {
        let _pipe = (() => {
          if (preview_type instanceof Preview) {
            let preview = preview_type[0];
            return toList([
              (() => {
                let _pipe = preview;
                return copy(_pipe);
              })(),
            ]);
          } else {
            return toList([
              (() => {
                let _pipe = self;
                return copy(_pipe);
              })(),
            ]);
          }
        })();
        let _pipe$1 = ((_capture) => {
          return component(drag_event_id, _capture);
        })(_pipe);
        return set_parameters(
          _pipe$1,
          toList([
            style(
              toList([
                ["position", "absolute"],
                ["top", "var(--mouse-y)"],
                ["left", "var(--mouse-x)"],
                ["min-width", "20px"],
                ["min-height", "20px"],
              ]),
            ),
          ]),
        );
      })();
      return toList([
        onmousedown(
          (_) => {
            let preview = (() => {
              let _pipe = preview_comp;
              return copy(_pipe);
            })();
            let event = new DragEvent(value, preview, on_drop, on_cancel, false);
            $state.update(drag_event, new Some(event));
            return on_drag(event);
          },
        ),
      ]);
    },
  );
}

function cleanup() {
  let state = $state.from_id(drag_event_id);
  return () => { return $state.update(state, new None()); };
}

export function init() {
  let drag_event = $state.create_with_id(drag_event_id, new None());
  global_listener(onmousemove((e) => { return store_mouse_position(e); }));
  global_listener(
    onmouseup(
      (_) => {
        let $ = $state.value(drag_event);
        if ($ instanceof Some && (!$[0].droppable)) {
          let event = $[0];
          return event.cancel(event, cleanup());
        } else {
          return undefined;
        }
      },
    ),
  );
  let _pipe = $state_component.utilize(
    drag_event,
    (event) => {
      if (event instanceof Some) {
        let event$1 = event[0];
        return event$1.preview;
      } else {
        return div(toList([]), toList([]));
      }
    },
  );
  return $render.add_to_viewport(_pipe, "_drag_");
}

export function ondrop(on_drag, on_hover, on_drop) {
  let drag_event = $state.from_id(drag_event_id);
  let _pipe = drag_event;
  $state.listen(
    _pipe,
    (event) => {
      if (event instanceof Some && (!event[0].droppable)) {
        let event$1 = event[0];
        return on_drag(event$1);
      } else {
        return undefined;
      }
    },
  )
  return new ParameterList(
    toList([
      onemouseover(
        (_) => {
          let $ = $state.value(drag_event);
          if ($ instanceof Some && $[0] instanceof DragEvent) {
            let value = $[0].value;
            let preview = $[0].preview;
            let cleanup$1 = $[0].drop;
            let cancel = $[0].cancel;
            let droppable = $[0].droppable;
            let event = new DragEvent(
              value,
              preview,
              cleanup$1,
              cancel,
              droppable,
            );
            return $state.update(
              drag_event,
              new Some(
                new DragEvent(
                  value,
                  preview,
                  cleanup$1,
                  cancel,
                  on_hover(event),
                ),
              ),
            );
          } else {
            return undefined;
          }
        },
      ),
      onmouseout(
        (_) => {
          let $ = $state.value(drag_event);
          if ($ instanceof Some) {
            let event = $[0];
            return $state.update(
              drag_event,
              new Some(
                new DragEvent(
                  event.value,
                  event.preview,
                  event.drop,
                  event.cancel,
                  false,
                ),
              ),
            );
          } else {
            return undefined;
          }
        },
      ),
      onmouseup(
        (_) => {
          let $ = $state.value(drag_event);
          if ($ instanceof Some && ($[0].droppable)) {
            let event = $[0];
            event.drop(event);
            return on_drop(event, cleanup());
          } else {
            return undefined;
          }
        },
      ),
    ]),
  );
}
