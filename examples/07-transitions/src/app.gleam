import gleam/int
import gleam/io
import novdom
import novdom/attribute.{style, tailwind}
import novdom/component.{text}
import novdom/html.{div, text as styled_text}
import novdom/listener.{onclick, ontransitionend, ontransitionstart}
import novdom/modifier.{onend, onrender, onstart, onunrender}
import novdom/state
import novdom/state_component

pub fn main() {
  use <- novdom.start()

  // state creation with initial value of 1

  let boolean = state.create(True)
  let counter = state.create(1)

  // parent component
  div([tailwind("p-5")], [
    div(
      [
        tailwind(
          "p-2 bg-green-200 select-none hover:bg-violet-600 active:bg-yellow-700",
        ),
        onclick(fn(_) {
          io.println("Button clicked!")
          state.update(boolean, !state.value(boolean))
          state.update(counter, state.value(counter) + 1)
          Nil
        }),
      ],
      // button children
      [text("current value: " <> "nothind")],
    ),
    state_component.if1(
      boolean,
      fn(value) { value },
      styled_text(
        [
          tailwind("bg-green-500 transition-all duration-[400ms] w-10 h-10"),
          onrender([tailwind("bg-red-500 w-96 h-96")]),
          onunrender([tailwind("bg-blue-500 w-10 h-10")], onstart),
        ],
        "current value: " <> "nothind",
      ),
    ),
    state_component.ternary1(
      boolean,
      fn(value) { value },
      div(
        [
          tailwind(
            "p-2 bg-yellow-200 select-none transition-all duration-[400ms] scale-0",
          ),
          onrender([tailwind("scale-100")]),
          onunrender([tailwind("scale-0")], onstart),
        ],
        // button children
        [
          text("current value: " <> "nothind"),
          text("current value: " <> "nothind"),
          text("current value: " <> "nothind"),
        ],
      ),
      div(
        [
          tailwind(
            "p-2 bg-blue-200 select-none transition-all duration-[400ms] scale-0",
          ),
          onrender([tailwind("scale-100")]),
          onunrender([tailwind("scale-0")], onstart),
        ],
        // button children
        [
          // wraped modifier dont get executed on state change (use a chain listener)
          styled_text(
            [
              tailwind("bg-green-500 transition-all duration-[4000ms]"),
              onrender([tailwind("bg-yellow-500")]),
              onunrender([tailwind("bg-blue-500")], onstart),
            ],
            "current value: " <> "nothind",
          ),
        ],
      ),
    ),
    state_component.utilize(counter, fn(value) {
      styled_text(
        [
          tailwind("bg-green-500 transition-all duration-[4000ms] w-10 h-10"),
          onrender([tailwind("bg-red-500 w-96 h-96")]),
          onunrender([tailwind("bg-blue-500 w-10 h-10")], onend),
        ],
        "current value: " <> int.to_string(value),
      )
    }),
  ])
}
