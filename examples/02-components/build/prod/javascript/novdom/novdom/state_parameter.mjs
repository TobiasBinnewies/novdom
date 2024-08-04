import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { toList, makeError } from "../gleam.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import {
  Attribute,
  Listener,
  ParameterContainer,
  get_component,
  remove_parameters,
  set_parameters,
} from "../novdom/internals/parameter.mjs";
import * as $utils from "../novdom/internals/utils.mjs";
import * as $state from "../novdom/state.mjs";
import { listen, value } from "../novdom/state.mjs";

export function utilize(state, do$) {
  let id = $utils.unique_id();
  let callback = (a) => {
    let component = (() => {
      let _pipe = id;
      return get_component(_pipe);
    })();
    let old = $utils.get_last_value(id);
    let new$ = do$(a);
    let _pipe = component;
    let _pipe$1 = remove_parameters(_pipe, old);
    set_parameters(_pipe$1, new$)
    $utils.set_last_value(id, new$);
    return undefined;
  };
  listen(state, callback);
  let initial = do$(value(state));
  $utils.set_last_value(id, initial);
  return new ParameterContainer(id, initial);
}

function check(params) {
  return $list.each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        return undefined;
      } else if (param instanceof Listener) {
        return undefined;
      } else {
        throw makeError(
          "panic",
          "novdom/state_parameter",
          183,
          "",
          "Only attributes and listeners are allowed",
          {}
        )
      }
    },
  );
}

export function if1(state, when, then$) {
  check(then$);
  let id = $utils.unique_id();
  let callback = (a) => {
    let component = (() => {
      let _pipe = id;
      return get_component(_pipe);
    })();
    let condition = when(a);
    let $ = $utils.get_last_value(id);
    if (condition && !$) {
      set_parameters(component, then$);
      undefined
    } else if (!condition && $) {
      remove_parameters(component, then$);
      undefined
    } else {
      undefined
    }
    return $utils.set_last_value(id, condition);
  };
  listen(state, callback);
  let initial = (() => {
    let $ = when(value(state));
    if ($) {
      $utils.set_last_value(id, true);
      return then$;
    } else {
      $utils.set_last_value(id, false);
      return toList([]);
    }
  })();
  return new ParameterContainer(id, initial);
}

export function if2(state1, state2, when, then$) {
  check(then$);
  let id = $utils.unique_id();
  let callback = (a, b) => {
    let component = (() => {
      let _pipe = id;
      return get_component(_pipe);
    })();
    let condition = when(a, b);
    let $ = $utils.get_last_value(id);
    if (condition && !$) {
      set_parameters(component, then$);
      undefined
    } else if (!condition && $) {
      remove_parameters(component, then$);
      undefined
    } else {
      undefined
    }
    return $utils.set_last_value(id, condition);
  };
  let callback1 = (a) => {
    let b = value(state2);
    return callback(a, b);
  };
  listen(state1, callback1);
  let callback2 = (b) => {
    let a = value(state1);
    return callback(a, b);
  };
  listen(state2, callback2);
  let initial = (() => {
    let $ = when(value(state1), value(state2));
    if ($) {
      $utils.set_last_value(id, true);
      return then$;
    } else {
      $utils.set_last_value(id, false);
      return toList([]);
    }
  })();
  return new ParameterContainer(id, initial);
}

export function ternary1(state, when, then$, otherwise) {
  check(then$);
  check(otherwise);
  let id = $utils.unique_id();
  let callback = (a) => {
    let component = (() => {
      let _pipe = id;
      return get_component(_pipe);
    })();
    let condition = when(a);
    let $ = $utils.get_last_value(id);
    if (condition && !$) {
      let _pipe = component;
      let _pipe$1 = remove_parameters(_pipe, otherwise);
      set_parameters(_pipe$1, then$)
      undefined
    } else if (!condition && $) {
      let _pipe = component;
      let _pipe$1 = remove_parameters(_pipe, then$);
      set_parameters(_pipe$1, otherwise)
      undefined
    } else {
      undefined
    }
    return $utils.set_last_value(id, condition);
  };
  listen(state, callback);
  let initial = (() => {
    let $ = when(value(state));
    if ($) {
      $utils.set_last_value(id, true);
      return then$;
    } else {
      $utils.set_last_value(id, false);
      return otherwise;
    }
  })();
  return new ParameterContainer(id, initial);
}
