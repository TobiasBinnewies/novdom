import { show, hide, swap } from "../document_ffi.mjs";
import { toList } from "../gleam.mjs";
import * as $component from "../novdom/component.mjs";
import { component, set_child } from "../novdom/component.mjs";
import * as $utils from "../novdom/internals/utils.mjs";
import * as $state from "../novdom/state.mjs";
import { listen, value } from "../novdom/state.mjs";

export function if1(state, when, then$) {
  let id = $utils.unique_id();
  let callback = (a) => {
    let condition = when(a);
    let $ = $utils.get_last_value(id);
    if (condition && !$) {
      show(then$);
      undefined
    } else if (!condition && $) {
      hide(then$, false);
      undefined
    } else {
      undefined
    }
    return $utils.set_last_value(id, condition);
  };
  listen(state, callback);
  let $ = when(value(state));
  if ($) {
    $utils.set_last_value(id, true)
  } else {
    $utils.set_last_value(id, false);
    hide(then$, true)
  }
  return then$;
}

const state_component_tag = "_STATE_COMPONENT_";

export function ternary1(state, when, then$, otherwise) {
  let component$1 = component(state_component_tag, toList([then$, otherwise]));
  let id = $utils.unique_id();
  let callback = (a) => {
    let condition = when(a);
    let $ = $utils.get_last_value(id);
    if (condition && !$) {
      swap(otherwise, then$);
      undefined
    } else if (!condition && $) {
      swap(then$, otherwise);
      undefined
    } else {
      undefined
    }
    return $utils.set_last_value(id, condition);
  };
  listen(state, callback);
  let $ = when(value(state));
  if ($) {
    $utils.set_last_value(id, true);
    hide(otherwise, true)
  } else {
    $utils.set_last_value(id, false);
    hide(then$, true)
  }
  return component$1;
}

export function utilize(state, do$) {
  let children = do$(value(state));
  let comp = component(state_component_tag, toList([children]));
  let callback = (a) => {
    let do$1 = do$(a);
    let _pipe = comp;
    set_child(_pipe, do$1)
    return undefined;
  };
  listen(state, callback);
  return comp;
}
