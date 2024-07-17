import novdom/attribute.{editable}
import novdom/component.{type Component, html, text}
import novdom/html.{div, p}
import novdom/internals/utils
import novdom/reference.{type Reference}

pub opaque type RichText {
  RichText(text: String, cursor_pos: Int, selection_length: Int)
}

pub fn store() -> State(RichText) {
  let id = utils.unique_id()
  state.create(RichText("<div>TEST</div>", 0, 0))
}

pub fn editor(store: State(RichText)) -> Component {
  div([editable()], [
    // {
    //   use text_container <- p([])
    //   use text_store <- state.render_children(store, text_container)
    //   [html(text_store.text)]
    // },
    text(state.value(store).text),
  ])
}
