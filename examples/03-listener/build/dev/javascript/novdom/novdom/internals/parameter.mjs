import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import {
  add_global_listener,
  add_attribute,
  remove_attribute,
  add_listener,
  remove_listener,
  add_render,
  add_unrender,
} from "../../document_ffi.mjs";
import { CustomType as $CustomType, makeError } from "../../gleam.mjs";
import * as $component from "../../novdom/component.mjs";

export {
  add_attribute,
  add_global_listener,
  add_listener,
  remove_attribute,
  remove_listener,
};

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
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class ParameterList extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class ComponentParameterList extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export function global_listener(listener) {
  if (!(listener instanceof Listener)) {
    throw makeError(
      "assignment_no_match",
      "novdom/internals/parameter",
      75,
      "global_listener",
      "Assignment pattern did not match",
      { value: listener }
    )
  }
  let name = listener.name;
  let callback = listener.callback;
  return add_global_listener(name, callback);
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
          68,
          "",
          "Can only remove attributes and listeners",
          {}
        )
      }
    },
  );
  return component;
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
      } else if (param instanceof ParameterList) {
        let params$1 = param[0];
        return set_parameters(component, params$1);
      } else if (param instanceof ComponentParameterList) {
        let f = param[0];
        return set_parameters(component, f(component));
      } else {
        let f = param[0];
        let $ = f(component);
        if ($ instanceof Render) {
          let render_fn = $[0];
          let _pipe = component;
          return add_render(_pipe, render_fn);
        } else {
          let render_fn = $[0];
          let trigger = $[1];
          let _pipe = component;
          return add_unrender(_pipe, render_fn, trigger);
        }
      }
    },
  );
  return component;
}
