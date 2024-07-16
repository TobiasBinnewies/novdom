import novdom/attribute.{hidden}
import novdom/component.{type Component, component, set_children}
import novdom/internals/parameter.{set_parameters}
import novdom/state.{type State, listen, value}
import novdom/state_parameter

const state_component_tag = "_STATE_COMPONENT_"

pub fn if1(
  state: State(a),
  when: fn(a) -> Bool,
  then: List(Component),
) -> Component {
  component(state_component_tag, then)
  |> set_parameters([state_parameter.if1(state, when, [hidden()])])
}

// pub fn if1(
//   state: State(a),
//   when: fn(a) -> Bool,
//   then: List(Component),
// ) -> Component {
//   let rendered = component(state_component_tag, fn(_) {then})
//   let unrendered = empty_component(state_component_tag)

//   let callback = fn(a) {
//     case when(a) {
//       True -> move_children(unrendered, rendered)
//       False -> move_children(rendered, unrendered)
//     }
//   }
//   listen(state, callback)

//   callback(value(state))

//   rendered
// }

pub fn ternary1(
  state: State(a),
  when: fn(a) -> Bool,
  then: List(Component),
  otherwise: List(Component),
) -> Component {
  let then =
    component(state_component_tag, then)
    |> set_parameters([state_parameter.if1(state, when, [hidden()])])

  let otherwise =
    component(state_component_tag, otherwise)
    |> set_parameters([
      state_parameter.if1(state, fn(a) { !when(a) }, [hidden()]),
    ])

  component(state_component_tag, [then, otherwise])
}

pub fn utilize(state: State(a), do: fn(a) -> List(Component)) -> Component {
  let children = do(value(state))
  let comp = component(state_component_tag, children)

  let callback = fn(a) {
    comp
    |> set_children(do(a))
    Nil
  }
  listen(state, callback)

  comp
}
