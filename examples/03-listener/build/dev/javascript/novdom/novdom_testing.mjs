import { CustomType as $CustomType } from "./gleam.mjs";
import * as $component from "./novdom/component.mjs";
import {
  component_in_document as component_visible,
  trigger_event,
  create_callee as create_callee_js,
  call_callee as call_callee_js,
  callee_count as callee_count_js,
} from "./testing_ffi.mjs";

export { component_visible, trigger_event };

class Callee extends $CustomType {
  constructor(id) {
    super();
    this.id = id;
  }
}

export function create_callee() {
  let _pipe = create_callee_js();
  return new Callee(_pipe);
}

export function call_callee(callee) {
  return call_callee_js(callee.id);
}

export function callee_count(callee) {
  return callee_count_js(callee.id);
}
