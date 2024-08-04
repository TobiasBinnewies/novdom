import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import * as $parameter from "../novdom/internals/parameter.mjs";
import { Attribute } from "../novdom/internals/parameter.mjs";

export function class$(value) {
  return new Attribute("class", value);
}

export function tailwind(value) {
  return new Attribute("tailwind", value);
}

export function style(values) {
  let res = $list.fold(
    values,
    "",
    (res, _use1) => {
      let key = _use1[0];
      let value = _use1[1];
      if (value === "") {
        return (res + key) + ";";
      } else {
        return (((res + key) + ":") + value) + ";";
      }
    },
  );
  return new Attribute("style", res);
}

export function hidden() {
  return new Attribute("hidden", "hidden");
}

export function editable() {
  return new Attribute("contenteditable", "true");
}
