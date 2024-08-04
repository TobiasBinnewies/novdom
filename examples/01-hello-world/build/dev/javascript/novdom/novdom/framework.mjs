import { init as init_js } from "../document_ffi.mjs";
import * as $component from "../novdom/component.mjs";
import * as $hotkey from "../novdom/hotkey.mjs";
import * as $motion from "../novdom/motion.mjs";
import * as $render from "../novdom/render.mjs";

export function start(component) {
  init_js();
  $motion.init();
  $hotkey.init();
  let _pipe = component();
  return $render.add_to_viewport(_pipe, "_app_");
}
