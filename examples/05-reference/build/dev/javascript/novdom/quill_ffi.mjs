import Quill from "quill/core"
import { Delta } from "quill/core"
import Inline from "quill/blots/inline"
import { get_element } from "./document_ffi.mjs"

const blobs = [
  class BoldBlot extends Inline {
    static blotName = "bold"
    static tagName = "strong"
    static defaultKey = ["b", "B"]
  },

  class ItalicBlot extends Inline {
    static blotName = "italic"
    static tagName = "em"
    static defaultKey = ["i", "I"]
  },

  class UnderlineBlot extends Inline {
    static blotName = "underline"
    static tagName = "u"
    static defaultKey = ["u", "U"]
  },
]

blobs.forEach((blob) => Quill.register(blob))

const bindings = blobs.reduce((acc, blob) => {
  acc[blob.blotName] = {
    key: blob.defaultKey[0],
    handler: () => {},
  }
  return acc
}, {})

export function init(comp) {
  const elem = get_element(comp)

  const quill = new Quill(elem, {
    modules: {
      keyboard: {
        bindings, // Remove all default bindings
      },
    },
  })

  quill.setContents(new Delta())

  return quill
}

export function format(store, format) {
  const format_value = format.constructor.name.toLowerCase()
  const is_set = store.quill.getFormat()[format_value]
  return store.quill.format(format_value, !is_set)
}

export function get_delta(store) {
  return store.quill.getContents()
}

export function get_text(store) {
  return store.quill.getText()
}
