import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$ } from "../novdom/novdom/attribute.mjs";
import * as $component from "../novdom/novdom/component.mjs";
import { text } from "../novdom/novdom/component.mjs";
import * as $container from "../novdom/novdom/container.mjs";
import {
  AroundSpacing,
  Center,
  EvenSpacing,
  Gap,
  Right,
  Left,
  Top,
  hstack,
  vstack,
  zstack,
  vscroll,
} from "../novdom/novdom/container.mjs";
import * as $framework from "../novdom/novdom/framework.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div } from "../novdom/novdom/html.mjs";
import * as $listener from "../novdom/novdom/listener.mjs";
import { onclick } from "../novdom/novdom/listener.mjs";
import * as $state from "../novdom/novdom/state.mjs";
import * as $state_component from "../novdom/novdom/state_component.mjs";
import { utilize } from "../novdom/novdom/state_component.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $framework.start(
    () => {
      let state = $state.create("Hello, world!");
      return vscroll(
        new Left(),
        new Gap("20px"),
        toList([
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
          div(
            toList([class$("p-5 bg-blue-100 select-none")]),
            toList([text("Hello, world!")]),
          ),
        ]),
      );
    },
  );
}
