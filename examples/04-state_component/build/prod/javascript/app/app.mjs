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
import * as $state_component from "../novdom/novdom/state_component.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $framework.start(
    () => {
      let boolean = $state.create(true);
      let counter = $state.create(1);
      return div(
        toList([class$("p-5")]),
        toList([
          div(
            toList([
              class$(
                "p-2 bg-green-200 select-none hover:bg-violet-600 active:bg-yellow-700",
              ),
              onclick(
                (_) => {
                  $io.println("Button clicked!");
                  $state.update(boolean, !$state.value(boolean));
                  $state.update(counter, $state.value(counter) + 1);
                  return undefined;
                },
              ),
            ]),
            toList([text("current value: " + "nothind")]),
          ),
          $state_component.if1(
            boolean,
            (value) => { return value; },
            text("current value: " + "nothind"),
          ),
          $state_component.ternary1(
            boolean,
            (value) => { return value; },
            div(
              toList([class$("p-2 bg-yellow-200 select-none")]),
              toList([
                text("current value: " + "nothind"),
                text("current value: " + "nothind"),
                text("current value: " + "nothind"),
              ]),
            ),
            div(
              toList([class$("p-2 bg-blue-200 select-none")]),
              toList([text("current value: " + "nothind")]),
            ),
          ),
          $state_component.utilize(
            counter,
            (value) => {
              return text("current value: " + $int.to_string(value));
            },
          ),
        ]),
      );
    },
  );
}
