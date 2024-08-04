import { toList, prepend as listPrepend } from "../gleam.mjs";
import * as $attribute from "../novdom/attribute.mjs";
import { style } from "../novdom/attribute.mjs";
import * as $component from "../novdom/component.mjs";
import { component } from "../novdom/component.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { set_parameters } from "../novdom/internals/parameter.mjs";

export function text(parameters, value) {
  let _pipe = $component.text(value);
  return set_parameters(_pipe, parameters);
}

export function textln(parameters, value) {
  let _pipe = $component.text(value);
  return set_parameters(
    _pipe,
    listPrepend(style(toList([["display", "block"]])), parameters),
  );
}

const div_tag = "div";

export function div(parameters, children) {
  let _pipe = component(div_tag, children);
  return set_parameters(_pipe, parameters);
}

const span_tag = "span";

export function span(parameters, children) {
  let _pipe = component(span_tag, children);
  return set_parameters(_pipe, parameters);
}

const p_tag = "p";

export function p(parameters, children) {
  let _pipe = component(p_tag, children);
  return set_parameters(_pipe, parameters);
}

const h1_tag = "h1";

export function h1(parameters, children) {
  let _pipe = component(h1_tag, children);
  return set_parameters(_pipe, parameters);
}

const h2_tag = "h2";

export function h2(parameters, children) {
  let _pipe = component(h2_tag, children);
  return set_parameters(_pipe, parameters);
}

const h3_tag = "h3";

export function h3(parameters, children) {
  let _pipe = component(h3_tag, children);
  return set_parameters(_pipe, parameters);
}
