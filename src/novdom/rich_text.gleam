// import novdom/attribute.{editable}
// import novdom/component.{type Component, html, text}
// import novdom/html.{div, p}
// import novdom/state.{type State}

// pub opaque type RichText {
//   RichText(text: String, cursor_pos: Int, selection_length: Int)
// }

// pub fn store() -> State(RichText) {
//   state.create(RichText("<div>TEST</div>", 0, 0))
// }

// pub fn editor(store: State(RichText)) -> Component {
//   use editor <- div([editable()])
//   [
//     // {
//     //   use text_container <- p([])
//     //   use text_store <- state.render_children(store, text_container)
//     //   [html(text_store.text)]
//     // },
//     text(state.value(store).text),
//   ]
// }
