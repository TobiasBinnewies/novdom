import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import {
  add_attribute,
  remove_attribute,
  add_listener,
  remove_listener,
  add_parameter as add_component_id,
  get_component_id,
  add_render,
  add_unrender,
} from "../../document_ffi.mjs";
import { CustomType as $CustomType, makeError } from "../../gleam.mjs";
import * as $component from "../../novdom/component.mjs";
import { get_component as get_comp } from "../../novdom/component.mjs";

export { add_attribute, add_listener, remove_attribute, remove_listener };

export class Start extends $CustomType {}

export class End extends $CustomType {}

export class Render extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Unrender extends $CustomType {
  constructor(x0, x1) {
    super();
    this[0] = x0;
    this[1] = x1;
  }
}

export class Attribute extends $CustomType {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
}

export class Listener extends $CustomType {
  constructor(name, callback) {
    super();
    this.name = name;
    this.callback = callback;
  }
}

export class Modifier extends $CustomType {
  constructor(id, x1) {
    super();
    this.id = id;
    this[1] = x1;
  }
}

export class ParameterContainer extends $CustomType {
  constructor(id, x1) {
    super();
    this.id = id;
    this[1] = x1;
  }
}

export function remove_parameters(component, params) {
  $list.each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        let key = param.name;
        let value = param.value;
        return remove_attribute(component, key, value);
      } else if (param instanceof Listener) {
        let name = param.name;
        let callback = param.callback;
        return remove_listener(component, name, callback);
      } else {
        throw makeError(
          "panic",
          "novdom/internals/parameter",
          69,
          "",
          "Can only remove attributes and listeners",
          {}
        )
      }
    },
  );
  return component;
}

export function get_component(param_id) {
  let _pipe = param_id;
  let _pipe$1 = get_component_id(_pipe);
  return get_comp(_pipe$1);
}

export function set_parameters(component, params) {
  $list.each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        let key = param.name;
        let value = param.value;
        return add_attribute(component, key, value);
      } else if (param instanceof Listener) {
        let name = param.name;
        let callback = param.callback;
        return add_listener(component, name, callback);
      } else if (param instanceof ParameterContainer) {
        let id = param.id;
        let params$1 = param[1];
        let _pipe = component;
        let _pipe$1 = add_component_id(_pipe, id);
        return set_parameters(_pipe$1, params$1);
      } else {
        let id = param.id;
        let store = param[1];
        if (store instanceof Render) {
          let render_fn = store[0];
          let _pipe = component;
          let _pipe$1 = add_component_id(_pipe, id);
          return add_render(_pipe$1, render_fn);
        } else {
          let render_fn = store[0];
          let trigger = store[1];
          let _pipe = component;
          let _pipe$1 = add_component_id(_pipe, id);
          return add_unrender(_pipe$1, render_fn, trigger);
        }
      }
    },
  );
  return component;
}
