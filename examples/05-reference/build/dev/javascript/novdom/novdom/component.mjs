import {
  create_element as component,
  create_text_element as text,
  create_copy as copy,
  set_child,
} from "../document_ffi.mjs";
import { CustomType as $CustomType } from "../gleam.mjs";
import * as $utils from "../novdom/internals/utils.mjs";

export { component, copy, set_child, text };

export class HTMLElement extends $CustomType {}

export class Component extends $CustomType {
  constructor(id, element) {
    super();
    this.id = id;
    this.element = element;
  }
}
