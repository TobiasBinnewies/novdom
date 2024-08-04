import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$, hidden } from "../novdom/novdom/attribute.mjs";
import * as $component from "../novdom/novdom/component.mjs";
import { text } from "../novdom/novdom/component.mjs";
import * as $framework from "../novdom/novdom/framework.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div } from "../novdom/novdom/html.mjs";
import * as $motion from "../novdom/novdom/motion.mjs";
import { ondrag, ondrop, Preview, Self } from "../novdom/novdom/motion.mjs";
import * as $state from "../novdom/novdom/state.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $framework.start(
    () => {
      return div(
        toList([]),
        toList([
          div(
            toList([
              class$("p-5 bg-blue-100 select-none"),
              ondrag(
                new Self(),
                "A",
                (e) => {
                  $io.debug("drag start");
                  return undefined;
                },
                (e, cleanup) => {
                  $io.debug("drag end");
                  return cleanup();
                },
                (e) => {
                  $io.debug("drag drop");
                  return undefined;
                },
              ),
            ]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([
              class$("p-5 bg-red-100 select-none"),
              ondrag(
                new Preview(
                  div(toList([class$("h-8 w-8 bg-red-400")]), toList([])),
                ),
                "A",
                (e) => {
                  $io.debug("drag start");
                  return undefined;
                },
                (e, cleanup) => {
                  $io.debug("drag end");
                  return cleanup();
                },
                (e) => {
                  $io.debug("drag drop");
                  return undefined;
                },
              ),
            ]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([
              class$("p-5 bg-green-100 select-none"),
              ondrag(
                new Preview(
                  div(toList([class$("h-8 w-8 bg-green-400")]), toList([])),
                ),
                "A",
                (e) => {
                  $io.debug("drag start");
                  return undefined;
                },
                (e, cleanup) => {
                  $io.debug("drag end");
                  return cleanup();
                },
                (e) => {
                  $io.debug("drag drop failed");
                  return undefined;
                },
              ),
            ]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([
              class$("p-5 bg-yellow-100 select-none"),
              ondrop(
                (e) => {
                  $io.debug("drag over");
                  return undefined;
                },
                (e) => {
                  $io.debug("drag hover");
                  return true;
                },
                (e, cleanup) => {
                  $io.debug("drag drop success");
                  return cleanup();
                },
              ),
            ]),
            toList([text("DROP")]),
          ),
        ]),
      );
    },
  );
}
