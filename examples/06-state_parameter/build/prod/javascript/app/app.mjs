import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$ } from "../novdom/novdom/attribute.mjs";
import * as $component from "../novdom/novdom/component.mjs";
import { text } from "../novdom/novdom/component.mjs";
import * as $framework from "../novdom/novdom/framework.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div } from "../novdom/novdom/html.mjs";
import * as $listener from "../novdom/novdom/listener.mjs";
import { onclick } from "../novdom/novdom/listener.mjs";
import * as $state from "../novdom/novdom/state.mjs";
import * as $state_parameter from "../novdom/novdom/state_parameter.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $framework.start(
    () => {
      let boolean = $state.create(false);
      let boolean2 = $state.create(false);
      return div(
        toList([
          class$("p-5"),
          $state_parameter.if1(
            boolean,
            (value) => { return value; },
            toList([class$("rounded-3xl")]),
          ),
          $state_parameter.if2(
            boolean,
            boolean2,
            (value1, value2) => { return value1 && value2; },
            toList([class$("scale-150")]),
          ),
          $state_parameter.ternary1(
            boolean,
            (value) => { return value; },
            toList([class$("bg-red-100")]),
            toList([class$("bg-blue-100")]),
          ),
          $state_parameter.utilize(
            boolean,
            (value) => {
              if (value) {
                return toList([class$("text-black")]);
              } else {
                return toList([class$("text-white")]);
              }
            },
          ),
        ]),
        toList([
          div(
            toList([
              class$("p-2 bg-green-200 select-none"),
              onclick(
                (_) => {
                  $io.println("Button clicked!");
                  $state.update(boolean, !$state.value(boolean));
                  return undefined;
                },
              ),
            ]),
            toList([text("current value: " + "nothind")]),
          ),
          div(
            toList([
              class$("p-2 bg-yellow-200 select-none"),
              onclick(
                (_) => {
                  $io.println("Button2 clicked!");
                  $state.update(boolean2, !$state.value(boolean2));
                  return undefined;
                },
              ),
            ]),
            toList([text("current value: " + "nothind")]),
          ),
        ]),
      );
    },
  );
}
