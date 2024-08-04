import * as $component from "../novdom/component.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { Modifier, Render, Unrender, get_component, set_parameters } from "../novdom/internals/parameter.mjs";
import * as $utils from "../novdom/internals/utils.mjs";

function render_fn(comp_id, parameters) {
  return () => {
    let _pipe = comp_id;
    let _pipe$1 = get_component(_pipe);
    set_parameters(_pipe$1, parameters)
    return undefined;
  };
}

export function onrender(parameters) {
  let id = $utils.unique_id();
  return new Modifier(id, new Render(render_fn(id, parameters)));
}

export function onunrender(parameters, trigger) {
  let id = $utils.unique_id();
  return new Modifier(id, new Unrender(render_fn(id, parameters), trigger));
}

export const onend = new $parameter.End();

export const onstart = new $parameter.Start();
