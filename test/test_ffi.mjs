import jsdom from "jsdom"
import fs from "fs"

if (typeof window === "undefined") {
  const html = fs.readFileSync("index.html", "utf8")
  const dom = new jsdom.JSDOM(html)
  global.window = dom.window
  global.document = dom.window.document
}

export function selector_in_document(selector) {
  return !!document.querySelectorAll(selector)
}
