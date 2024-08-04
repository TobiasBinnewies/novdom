import * as $gleeunit from "../gleeunit/gleeunit.mjs";
import * as $should from "../gleeunit/gleeunit/should.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$ } from "../novdom/novdom/attribute.mjs";
import * as $framework from "../novdom/novdom/framework.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div, text } from "../novdom/novdom/html.mjs";
import * as $listener from "../novdom/novdom/listener.mjs";
import { onclick } from "../novdom/novdom/listener.mjs";
import * as $testing from "../novdom_testing/novdom_testing/testing.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $gleeunit.main();
}

export function component_test() {
  let button_callee = $testing.create_callee();
  let button = div(
    toList([
      onclick(
        (_) => {
          let _pipe = button_callee;
          return $testing.call_callee(_pipe);
        },
      ),
    ]),
    toList([]),
  );
  $framework.start(
    () => {
      return div(
        toList([class$("p-5 bg-blue-100 select-none")]),
        toList([text(toList([]), "Hello, world!"), button]),
      );
    },
  );
  $testing.trigger_event(button, "click");
  let _pipe = $testing.callee_count(button_callee);
  return $should.equal(_pipe, 1);
}
