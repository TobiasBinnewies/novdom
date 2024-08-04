import { toList, CustomType as $CustomType } from "../gleam.mjs";
import * as $attribute from "../novdom/attribute.mjs";
import { editable } from "../novdom/attribute.mjs";
import * as $component from "../novdom/component.mjs";
import { component } from "../novdom/component.mjs";
import * as $html from "../novdom/html.mjs";
import { div, p } from "../novdom/html.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { get_component } from "../novdom/internals/parameter.mjs";
import * as $utils from "../novdom/internals/utils.mjs";
import * as $reference from "../novdom/reference.mjs";
import { InnerHTML } from "../novdom/reference.mjs";
import { init as init_quill, get_delta as delta, get_text as text, format } from "../quill_ffi.mjs";

export { delta, format, text };

class RichTextStore extends $CustomType {
  constructor(quill, component) {
    super();
    this.quill = quill;
    this.component = component;
  }
}

export class Bold extends $CustomType {}

export class Italic extends $CustomType {}

export class Underline extends $CustomType {}

export function editor(store) {
  return store.component;
}

export function store() {
  let comp = component("div", toList([]));
  let quill = init_quill(comp);
  return new RichTextStore(quill, comp);
}
