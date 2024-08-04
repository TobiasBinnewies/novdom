import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { style, tailwind } from "../novdom/novdom/attribute.mjs";
import * as $component from "../novdom/novdom/component.mjs";
import { text } from "../novdom/novdom/component.mjs";
import * as $framework from "../novdom/novdom/framework.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div, text as styled_text } from "../novdom/novdom/html.mjs";
import * as $listener from "../novdom/novdom/listener.mjs";
import { onclick, ontransitionend, ontransitionstart } from "../novdom/novdom/listener.mjs";
import * as $modifier from "../novdom/novdom/modifier.mjs";
import { onend, onrender, onstart, onunrender } from "../novdom/novdom/modifier.mjs";
import * as $state from "../novdom/novdom/state.mjs";
import * as $state_component from "../novdom/novdom/state_component.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $framework.start(
    () => {
      let boolean = $state.create(true);
      let counter = $state.create(1);
      return div(
        toList([tailwind("p-5")]),
        toList([
          div(
            toList([
              tailwind(
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
            styled_text(
              toList([
                tailwind(
                  "bg-green-500 transition-all duration-[400ms] w-10 h-10",
                ),
                onrender(toList([tailwind("bg-red-500 w-96 h-96")])),
                onunrender(toList([tailwind("bg-blue-500 w-10 h-10")]), onstart),
              ]),
              "current value: " + "nothind",
            ),
          ),
          $state_component.ternary1(
            boolean,
            (value) => { return value; },
            div(
              toList([
                tailwind(
                  "p-2 bg-yellow-200 select-none transition-all duration-[400ms] scale-0",
                ),
                onrender(toList([tailwind("scale-100")])),
                onunrender(toList([tailwind("scale-0")]), onstart),
              ]),
              toList([
                text("current value: " + "nothind"),
                text("current value: " + "nothind"),
                text("current value: " + "nothind"),
              ]),
            ),
            div(
              toList([
                tailwind(
                  "p-2 bg-blue-200 select-none transition-all duration-[400ms] scale-0",
                ),
                onrender(toList([tailwind("scale-100")])),
                onunrender(toList([tailwind("scale-0")]), onstart),
              ]),
              toList([
                styled_text(
                  toList([
                    tailwind("bg-green-500 transition-all duration-[4000ms]"),
                    onrender(toList([tailwind("bg-yellow-500")])),
                    onunrender(toList([tailwind("bg-blue-500")]), onstart),
                  ]),
                  "current value: " + "nothind",
                ),
              ]),
            ),
          ),
          $state_component.utilize(
            counter,
            (value) => {
              return styled_text(
                toList([
                  tailwind(
                    "bg-green-500 transition-all duration-[4000ms] w-10 h-10",
                  ),
                  onrender(toList([tailwind("bg-red-500 w-96 h-96")])),
                  onunrender(toList([tailwind("bg-blue-500 w-10 h-10")]), onend),
                ]),
                "current value: " + $int.to_string(value),
              );
            },
          ),
        ]),
      );
    },
  );
}
