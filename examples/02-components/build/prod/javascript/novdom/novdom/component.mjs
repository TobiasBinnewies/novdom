import * as $function from "../../gleam_stdlib/gleam/function.mjs";
import {
  get_element as create_element,
  get_element as create_text_element,
  create_copy,
  set_child,
} from "../document_ffi.mjs";
import { CustomType as $CustomType } from "../gleam.mjs";
import * as $utils from "../novdom/internals/utils.mjs";

export { set_child };

class Component extends $CustomType {
  constructor(id, tag) {
    super();
    this.id = id;
    this.tag = tag;
  }
}

export function document() {
  return new Component("document", "");
}

export function get_component(id) {
  return new Component(id, "");
}

export function component(tag, children) {
  let _pipe = $utils.unique_id();
  let _pipe$1 = new Component(_pipe, tag);
  return $function.tap(
    _pipe$1,
    (_capture) => { return create_element(_capture, children); },
  );
}

export function copy(comp) {
  let id = $utils.unique_id();
  return create_copy(comp, id);
}

const text_tag = "p";

export function text(value) {
  let _pipe = $utils.unique_id();
  let _pipe$1 = new Component(_pipe, text_tag);
  return $function.tap(
    _pipe$1,
    (_capture) => { return create_text_element(_capture, value); },
  );
}

const html_tag = "_HTML_";

export function html(value) {
  return new Component(html_tag, value);
}
