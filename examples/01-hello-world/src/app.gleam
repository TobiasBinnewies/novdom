import novdom
import novdom/attribute.{class}
import novdom/html.{div, text, textln}

pub fn main() {
  use <- novdom.start()

  // parent component
  div(
    [
      class(
        "p-5 bg-[#272822] select-none flex justify-center items-center h-screen w-screen size-100 text-2xl font-mono",
      ),
    ],
    // child components
    [
      // simple text component
      text([class("text-white")], "<"),
      text([class("text-[#F82873] ")], "Hello"),
      text([], " "),
      text([class("text-[#A7E230]")], "World"),
      text([class("text-white")], "/>"),
    ],
  )
}
