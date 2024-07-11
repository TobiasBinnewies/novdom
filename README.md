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
- 💼 Parameter
    - Attributes (class, style, ... | -> value | init values) / Listener (onclick, ... | -> fn -> Nil | can change state) / Modifier (onrender, ... | -> fn -> List(Paramenter) | modify init values)
- ⚠️ State
    - State Parameter (Attributes / Listener that can be changed on state change)
    - State Types? (eg Bool, String, ..., Custom)
    eg:
    div([
        class("p-5"),

        state_parameter.if(state(bool), class("bg-red-500"))
        state_parameter.if_fn(state(a), fn(a) -> bool, class("bg-red-500")),

        state_parameter.utilize(state(a), fn(a) -> List(Paramenter)), // rename?

        state_parameter.ternary(state(bool), class("bg-red-500"), class("bg-blue-500")),
        state_parameter.ternary_fn(state(a), fn(a) -> bool, class("bg-red-500"), class("bg-blue-500")),

        onclick(fn(e) -> Nil),
        onrender(fn(e) -> List(Paramenter)), // on init render or state render
        offrender(fn(e, cleanup_fn) -> List(Paramenter)), // { [transform("10px"), ontransitionend(cleanup_fn)] } // on state render change; if not set, cleanup_fn will be called instantly
    ], [
        state_component.ternary(state(bool), text("Hello"), text("World")), // will be cached
        state_component.if(state(bool), text("Hello")), // possible? // will be cached

        state_component.utilize(state(a), fn(a) -> List(Component)), // Last possible resource
    ])

    - State Map Function / ListState Type??
    Like:
    type State(value_type) {
        State(state_id: String)
        StateItem(state_id: String, item_id: String)
    }

    eg:
    use ListStateItem(value) <- state_component.map(State(List(value))) --> List(Component)
    
    // value: ListStateItem(a), new_value: a, index: Int
    state.remove(value)
    state.move(value, index)
    state.insert_before(value, new_value)
    state.insert_after(value, new_value)
    state.replace(value, new_value)
    <!-- state.hide(value)
    state.show(value) -->
    



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