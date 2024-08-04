// import argv
// import gleam/io
// import glint

// pub fn main() {
//   let args = argv.load().arguments

//   glint.new()
//   |> glint.as_module
//   |> glint.with_name("cli/dev")
//   |> glint.add(at: ["build"], do: build())
//   |> glint.run(args)
// }

// fn build() {
//     glint.command(fn(_, _, _) {
//         io.debug("Building...")

//     })
// }
