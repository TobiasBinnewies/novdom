import gleam/list
import novdom/internals/parameter.{
  type Parameter, Attribute, Listener, ParameterContainer, get_component,
  remove_parameters, set_parameters,
}
import novdom/internals/utils.{unique_id}
import novdom/state.{type State, listen, value}

pub fn if1(
  state: State(a),
  when: fn(a) -> Bool,
  then: List(Parameter),
) -> Parameter {
  check(then)

  let state_param_id = unique_id()

  let callback = fn(a) {
    let component =
      state_param_id
      |> get_component
    case when(a) {
      True -> set_parameters(component, then)
      False -> remove_parameters(component, then)
    }
    Nil
  }
  listen(state, callback)

  let initial = case when(value(state)) {
    True -> then
    False -> []
  }

  ParameterContainer(state_param_id, initial)
}

pub fn if2(
  state1: State(a),
  state2: State(b),
  when: fn(a, b) -> Bool,
  then: List(Parameter),
) -> Parameter {
  check(then)

  let state_param_id = unique_id()

  let callback = fn(a, b) {
    let component =
      state_param_id
      |> get_component
    case when(a, b) {
      True -> set_parameters(component, then)
      False -> remove_parameters(component, then)
    }
    Nil
  }

  let callback1 = fn(a) {
    let b = value(state2)
    callback(a, b)
  }
  listen(state1, callback1)

  let callback2 = fn(b) {
    let a = value(state1)
    callback(a, b)
  }
  listen(state2, callback2)

  let initial = case when(value(state1), value(state2)) {
    True -> then
    False -> []
  }

  ParameterContainer(state_param_id, initial)
}

pub fn ternary1(
  state: State(a),
  when: fn(a) -> Bool,
  then: List(Parameter),
  otherwise: List(Parameter),
) -> Parameter {
  check(then)
  check(otherwise)

  let state_param_id = unique_id()

  let callback = fn(a) {
    let component =
      state_param_id
      |> get_component
    case when(a) {
      True -> {
        component
        |> remove_parameters(otherwise)
        |> set_parameters(then)
      }
      False -> {
        component
        |> remove_parameters(then)
        |> set_parameters(otherwise)
      }
    }
    Nil
  }
  listen(state, callback)

  let initial = case when(value(state)) {
    True -> then
    False -> otherwise
  }

  ParameterContainer(state_param_id, initial)
}

pub fn utilize(state: State(a), do: fn(a) -> List(Parameter)) -> Parameter {
  let state_param_id = unique_id()
  let callback = fn(a) {
    let component =
      state_param_id
      |> get_component
    let old = get_last_state_parameter_value(state_param_id)
    let new = do(a)
    component
    |> remove_parameters(old)
    |> set_parameters(new)

    set_last_state_parameter_value(state_param_id, new)
    Nil
  }
  listen(state, callback)

  let initial = do(value(state))
  set_last_state_parameter_value(state_param_id, initial)

  ParameterContainer(state_param_id, initial)
}

fn check(params: List(Parameter)) -> Nil {
  use param <- list.each(params)
  case param {
    Attribute(_, _) -> Nil
    Listener(_, _) -> Nil
    _ -> panic as "Only attributes and listeners are allowed"
  }
}

@external(javascript, "../document_ffi.mjs", "set_last_state_parameter_value")
fn set_last_state_parameter_value(
  state_param_id: String,
  value: List(Parameter),
) -> Nil

@external(javascript, "../document_ffi.mjs", "get_last_state_parameter_value")
fn get_last_state_parameter_value(state_param_id: String) -> List(Parameter)
