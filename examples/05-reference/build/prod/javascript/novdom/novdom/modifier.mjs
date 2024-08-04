import * as $component from "../novdom/component.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { Modifier, Render, Unrender, set_parameters } from "../novdom/internals/parameter.mjs";

function render_fn(component, parameters) {
  return () => {
    let _pipe = component;
    set_parameters(_pipe, parameters)
    return undefined;
  };
}

export function onrender(parameters) {
  return new Modifier(
    (component) => { return new Render(render_fn(component, parameters)); },
  );
}

export function onunrender(parameters, trigger) {
  return new Modifier(
    (component) => {
      return new Unrender(render_fn(component, parameters), trigger);
    },
  );
}

export const onend = new $parameter.End();

export const onstart = new $parameter.Start();
