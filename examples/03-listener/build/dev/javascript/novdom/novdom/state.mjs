import { get_state, set_state, update_state, add_state_listener } from "../document_ffi.mjs";
import { CustomType as $CustomType } from "../gleam.mjs";
import * as $utils from "../novdom/internals/utils.mjs";

export class State extends $CustomType {
  constructor(state_id) {
    super();
    this.state_id = state_id;
  }
}

export class StateItem extends $CustomType {
  constructor(state_id, item_id) {
    super();
    this.state_id = state_id;
    this.item_id = item_id;
  }
}

export function from_id(id) {
  return new State(id);
}

export function value(state) {
  return get_state(state.state_id);
}

export function create(init) {
  let id = $utils.unique_id();
  set_state(id, init);
  return new State(id);
}

export function create_with_id(id, init) {
  set_state(id, init);
  return new State(id);
}

export function update(state, new$) {
  return update_state(state.state_id, new$);
}

export function listen(state, callback) {
  return add_state_listener(state.state_id, callback);
}
