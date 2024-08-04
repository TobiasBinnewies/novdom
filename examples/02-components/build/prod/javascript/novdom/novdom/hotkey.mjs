import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import {
  get_hotkeys as get_keys,
  get_hotkey_ids as get_ids,
  override_hotkey as override,
  add_hotkey as add,
  remove_hotkey as remove,
  keypress_callback,
  set_hotkey_listener,
} from "../document_ffi.mjs";
import { toList, CustomType as $CustomType } from "../gleam.mjs";
import * as $component from "../novdom/component.mjs";
import { document } from "../novdom/component.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { set_parameters } from "../novdom/internals/parameter.mjs";
import * as $utils from "../novdom/internals/utils.mjs";
import * as $listener from "../novdom/listener.mjs";
import { onkeydown } from "../novdom/listener.mjs";

export {
  add,
  get_ids,
  get_keys,
  keypress_callback,
  override,
  remove,
  set_hotkey_listener,
};

export class Shift extends $CustomType {}

export class Alt extends $CustomType {}

export class Short extends $CustomType {}

export class Hotkey extends $CustomType {
  constructor(code, modifiers) {
    super();
    this.code = code;
    this.modifiers = modifiers;
  }
}

export class Key extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Id extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export function configure_ids(config) {
  return $list.each(
    config,
    (_use0) => {
      let id = _use0[0];
      let keys = _use0[1];
      return $list.each(keys, (key) => { return add(id, key); });
    },
  );
}

export function init() {
  let _pipe = document();
  set_parameters(_pipe, toList([onkeydown(keypress_callback)]))
  return undefined;
}

export function with_hotkey(option, callback) {
  let id = (() => {
    if (option instanceof Key) {
      let hotkey = option[0];
      let id = $utils.unique_id();
      add(id, hotkey);
      return id;
    } else {
      let id = option[0];
      return id;
    }
  })();
  set_hotkey_listener(id, callback);
  return callback;
}
