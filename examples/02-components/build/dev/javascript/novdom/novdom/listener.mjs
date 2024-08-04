import { create_once } from "../document_ffi.mjs";
import { makeError } from "../gleam.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { Listener } from "../novdom/internals/parameter.mjs";

export { create_once };

export function onclick(callback) {
  return new Listener("click", callback);
}

export function onmousemove(callback) {
  return new Listener("mousemove", callback);
}

export function onemouseover(callback) {
  return new Listener("mouseover", callback);
}

export function onmouseout(callback) {
  return new Listener("mouseout", callback);
}

export function onmousedown(callback) {
  return new Listener("mousedown", callback);
}

export function onmouseup(callback) {
  return new Listener("mouseup", callback);
}

export function onkeydown(callback) {
  return new Listener("keydown", callback);
}

export function ontransitionend(callback) {
  return new Listener("transitionend", callback);
}

export function ontransitionstart(callback) {
  return new Listener("transitionstart", callback);
}

export function once(listener) {
  if (listener instanceof Listener) {
    let event = listener.name;
    let callback = listener.callback;
    return new Listener(event, create_once(callback));
  } else {
    throw makeError(
      "panic",
      "novdom/listener",
      46,
      "once",
      "Listener expected",
      {}
    )
  }
}
