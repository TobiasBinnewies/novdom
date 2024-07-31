# novdom

❗️❗️DISCLAIMER: This project is in a very early stage and is not ready for production use.❗️❗️

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
- ✅ Parameter / ⁉️ Modifier (have been postponed for now)
  - Attributes (class, style, ... | -> value | init values) / Listener (onclick, ... | -> fn -> Nil | can change state) / Modifier (onrender, ... | -> fn -> List(Paramenter) | modify init values)
- ✅ State
  - State Parameter (Attributes / Listener that can be changed on state change)
  - State Components (Components that can be changed on state change)
  - 💼 State Map Function / ListState Type?? \
    eg: \
    use ListStateItem(value) <- state_list.map(State(List(value))) --> List(Component) \
    // value: ListStateItem(a), new_value: a, index: Int \
    state_list.remove(value) \
    state_list.move(value, index) \
    state_list.insert_before(value, new_value) \
    state_list.insert_after(value, new_value) \
    state_list.replace(value, new_value)
- ✅ Drag and Drop
- 💼 Rich Text Editor
- ❌ Router
  - Make use of unrendered
- ❌ Server Components
- ❌ Resumability (like Qwik)

- ⁉️ Backend (making use of Gleams compiling → Erlang / JavaScript)

# Notes

<!-- - ondrag / ondrop motion callbacks need to return Parameter to update the component itself without state overhead
- if some other component need to be changed on drag / drop motion, the state should be used -->

- state_components need render / unrender modifier to animate the change
  unredner: unrender(List(Paramenter), UnrednderListener, NewRenderListener) -> Modifier
- HOW TO HANDLE A CHANGING STATE_COMP INSIDE A STATE_COMP? (the unrender of the parent comp could be called before the child comp is unrendered)
  --> chain listener: let chain: fn(Listener) -> Listener = chain_listener.create(),

TODO: Custom HTML Tags need a display attribute otherwise transform will not work


Comp Map Usage:
- References
- Modifier (onrender, onunrender)
- ParamterContainer (ondrag, ondrop - unused, state_parameter)