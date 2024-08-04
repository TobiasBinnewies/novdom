import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $novdom from "../novdom/novdom.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$ } from "../novdom/novdom/attribute.mjs";
import * as $component from "../novdom/novdom/component.mjs";
import { text } from "../novdom/novdom/component.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div } from "../novdom/novdom/html.mjs";
import * as $listener from "../novdom/novdom/listener.mjs";
import { onclick } from "../novdom/novdom/listener.mjs";
import { toList } from "./gleam.mjs";

function random_color() {
  let r = $int.random(256);
  let g = $int.random(256);
  let b = $int.random(256);
  return ((((("rgb(" + $int.to_string(r)) + ", ") + $int.to_string(g)) + ", ") + $int.to_string(
    b,
  )) + ")";
}

export function main() {
  return $novdom.start(
    () => {
      return div(
        toList([class$("p-5 bg-blue-100")]),
        toList([
          div(
            toList([
              class$("p-2 bg-green-200 select-none"),
              onclick(
                (_) => {
                  $io.println("Button clicked!");
                  $io.println(
                    "Any javascript can be executed here: " + random_color(),
                  );
                  return undefined;
                },
              ),
            ]),
            toList([text("Click me!")]),
          ),
        ]),
      );
    },
  );
}
