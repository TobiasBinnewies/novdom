import gleam/io
import novdom/attribute.{hidden}
import novdom/component.{type Component, component, set_child}
import novdom/internals/parameter.{set_parameters}
import novdom/internals/utils
import novdom/state.{type State, listen, value}
import novdom/state_parameter

const state_component_tag = "_STATE_COMPONENT_"

// TODO: Change to only one component
// pub fn if1(state: State(a), when: fn(a) -> Bool, then: Component) -> Component {
//   component(state_component_tag, [then])
//   |> set_parameters([state_parameter.if1(state, fn(a) { !when(a) }, [hidden()])])
// }

// TODO: FIX: Onunrender params are applied on second render
pub fn if1(state: State(a), when: fn(a) -> Bool, then: Component) -> Component {
  let id = utils.unique_id()

  let callback = fn(a) {
    let condition = when(a)
    case condition, utils.get_last_value(id) {
      True, False -> {
        show(then)
        Nil
      }
      False, True -> {
        hide(then, False)
        Nil
      }
      _, _ -> Nil
    }
    utils.set_last_value(id, condition)
  }
  listen(state, callback)

  case when(value(state)) {
    True -> {
      utils.set_last_value(id, True)
    }
    False -> {
      utils.set_last_value(id, False)
      hide(then, True)
    }
  }

  then
}

// pub fn if1(
//   state: State(a),
//   when: fn(a) -> Bool,
//   then: Component,
// ) -> Component {
//   let id = utils.unique_id()
//   let rendered = component(state_component_tag, [])
//   let unrendered = component(state_component_tag, [then])

//   let callback = fn(a) {
//     let condition = when(a)
//     case condition, get_last_condition(id) {
//       True, False -> {
//         rendered

//       }
//       False, True -> move_children(rendered, unrendered)
//       _, _ -> Nil
//     }
//     set_last_condition(id, condition)
//   }
//   listen(state, callback)

//   set_last_condition(id, False)

//   callback(value(state))

//   rendered
// }

pub fn ternary1(
  state: State(a),
  when: fn(a) -> Bool,
  then: Component,
  otherwise: Component,
) -> Component {
  let component = component(state_component_tag, [then, otherwise])
  let id = utils.unique_id()

  let callback = fn(a) {
    let condition = when(a)
    case condition, utils.get_last_value(id) {
      True, False -> {
        // hide(otherwise, fn() { show(then) }, False)
        swap(otherwise, then)
        Nil
      }
      False, True -> {
        // hide(then, fn() { show(otherwise) }, False)
        swap(then, otherwise)
        Nil
      }
      _, _ -> Nil
    }
    utils.set_last_value(id, condition)
  }
  listen(state, callback)

  case when(value(state)) {
    True -> {
      utils.set_last_value(id, True)
      hide(otherwise, True)
    }
    False -> {
      utils.set_last_value(id, False)
      hide(then, True)
    }
  }

  component
}

pub fn utilize(state: State(a), do: fn(a) -> Component) -> Component {
  let children = do(value(state))
  let comp = component(state_component_tag, [children])

  let callback = fn(a) {
    let do = do(a)
    comp
    |> set_child(do)
    Nil
  }
  listen(state, callback)

  comp
}

@external(javascript, "../document_ffi.mjs", "show")
fn show(component: Component) -> Nil

@external(javascript, "../document_ffi.mjs", "hide")
fn hide(component: Component, initial: Bool) -> Nil

@external(javascript, "../document_ffi.mjs", "swap")
fn swap(this: Component, for: Component) -> Nil
