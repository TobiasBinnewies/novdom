import { read_reference as value, add_reference } from "../document_ffi.mjs";
import { toList, CustomType as $CustomType } from "../gleam.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { ParameterContainer } from "../novdom/internals/parameter.mjs";
import * as $utils from "../novdom/internals/utils.mjs";

export { value };

export class Value extends $CustomType {}

export class InnerHTML extends $CustomType {}

export class Reference extends $CustomType {
  constructor(id) {
    super();
    this.id = id;
  }
}

export function create() {
  let id = $utils.unique_id();
  return new Reference(id);
}

export function from_id(id) {
  return new Reference(id);
}

export function set(ref, ref_type) {
  add_reference(ref, ref_type);
  return new ParameterContainer(ref.id, toList([]));
}