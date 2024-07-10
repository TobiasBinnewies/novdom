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
    - Keep Fn as Children?
- ⚠️ State
    - State Parameter (Attributes / Listener that can be changed on state change)
- ⚠️ Stateful Components
    - Cleanup Fn (Default: Remove Children): fn(old_state, new_state, renderFn) -> Nil
    - Render Stateful after others (Enable Animations on render)
- ✅ Attributes
    - Enable only on stateful?
- ✅ Listener
    - Add once / remove
    - Make same type as attributes
- ✅❔ Drag and Drop
- 💼 Rich Text Editor
- ❌ Router
    - Make use of unrendered
- ❌ Server Components
- ❌ Resumability (like Qwik)

- ⁉️ Backend (making use of Gleams compiling → Erlang / JavaScript)