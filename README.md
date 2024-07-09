# novdom

An easy to use frontend framework written in Gleam.

No use of a virtual DOM to ensure the best performance possible.

Use [lustre_dev_tools](https://hexdocs.pm/lustre_dev_tools/index.html) for building / bundling and hot reloading.

# prequisites

- [gleam](https://gleam.run/getting-started/installing/)
- [bun](https://bun.sh/docs/installation)
- [nodejs](https://nodejs.org/en/download/prebuilt-installer) (for testing)

# getting started

- clone the repo
- run `bun install`
- run `gleam deps download`
- go to `/examples/...` and run `gleam run -m lustre/dev start`

# features / todos

✅ = done \
⚠️ = done but needs improvement \
💼 = gets worked on / comming soon \
❌ = not implemented yet \
⁉️ = not sure when and how to implement

- ✅ Components / Default HTML Components
- ⚠️ State (Stateful Components)
- ✅ Attributes
- ✅ Listener
- ✅❔ Drag and Drop
- 💼 Rich Text Editor
- ❌ Router
- ❌ Server Components
- ❌ Resumability (like Qwik)

- ⁉️ Backend (making use of Gleams compiling → Erlang / JavaScript)