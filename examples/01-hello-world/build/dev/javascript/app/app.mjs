import * as $novdom from "../novdom/novdom.mjs";
import * as $attribute from "../novdom/novdom/attribute.mjs";
import { class$ } from "../novdom/novdom/attribute.mjs";
import * as $html from "../novdom/novdom/html.mjs";
import { div, text, textln } from "../novdom/novdom/html.mjs";
import { toList } from "./gleam.mjs";

export function main() {
  return $novdom.start(
    () => {
      return div(
        toList([
          class$(
            "p-5 bg-[#272822] select-none flex justify-center items-center h-screen w-screen size-100 text-2xl font-mono",
          ),
        ]),
        toList([
          text(toList([class$("text-white")]), "<"),
          text(toList([class$("text-[#F82873] ")]), "Hello"),
          text(toList([]), " "),
          text(toList([class$("text-[#A7E230]")]), "World"),
          text(toList([class$("text-white")]), "/>"),
        ]),
      );
    },
  );
}
