import * as $io from "../gleam_stdlib/gleam/io.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$ } from "../novdom/novdom/attribute.mjs";
import * as $component from "../novdom/novdom/component.mjs";
import { text } from "../novdom/novdom/component.mjs";
import * as $framework from "../novdom/novdom/framework.mjs";
import * as $hotkey from "../novdom/novdom/hotkey.mjs";
import { Alt, Hotkey, Id, Shift, Short, with_hotkey } from "../novdom/novdom/hotkey.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div } from "../novdom/novdom/html.mjs";
import * as $listener from "../novdom/novdom/listener.mjs";
import { onclick, onkeydown } from "../novdom/novdom/listener.mjs";
import * as $rich_text from "../novdom/novdom/rich_text.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $framework.start(
    () => {
      $hotkey.configure_ids(
        toList([
          [
            "bold",
            toList([
              new Hotkey("KeyB", toList([new Short()])),
              new Hotkey("KeyB", toList([new Short(), new Shift()])),
              new Hotkey("KeyB", toList([new Short(), new Alt()])),
            ]),
          ],
          [
            "italic",
            toList([
              new Hotkey("KeyI", toList([new Short()])),
              new Hotkey("KeyB", toList([new Short(), new Alt()])),
            ]),
          ],
          ["underline", toList([new Hotkey("KeyU", toList([new Short()]))])],
        ]),
      );
      let store = $rich_text.store();
      return div(
        toList([class$("p-5 bg-blue-100")]),
        toList([
          $rich_text.editor(store),
          div(
            toList([
              class$("p-5 bg-blue-100 select-none"),
              onclick(
                with_hotkey(
                  new Id("bold"),
                  (_) => {
                    $rich_text.format(store, new $rich_text.Bold());
                    return undefined;
                  },
                ),
              ),
              onkeydown((_) => { return $io.println("keydown"); }),
            ]),
            toList([text("Bold")]),
          ),
          div(
            toList([
              class$("p-5 bg-blue-100 select-none"),
              onclick(
                with_hotkey(
                  new Id("italic"),
                  (_) => {
                    $rich_text.format(store, new $rich_text.Italic());
                    return undefined;
                  },
                ),
              ),
              onkeydown((_) => { return $io.println("keydown"); }),
            ]),
            toList([text("Italic")]),
          ),
        ]),
      );
    },
  );
}
