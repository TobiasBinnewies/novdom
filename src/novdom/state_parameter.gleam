import gleam/list
import novdom/internals/parameter.{
  type Parameter, Attribute, Listener, ParameterContainer, get_component,
  remove_parameters, set_parameters,
}
import novdom/internals/utils
import novdom/state.{type State, listen, value}

pub fn if1(
  state: State(a),
  when: fn(a) -> Bool,
  then: List(Parameter),
) -> Parameter {
  check(then)

  let id = utils.unique_id()

  let callback = fn(a) {
    let component =
      id
      |> get_component
    let condition = when(a)
    case condition, utils.get_last_value(id) {
      True, False -> {
        set_parameters(component, then)
        Nil
      }
      False, True -> {
        remove_parameters(component, then)
        Nil
      }
      _, _ -> Nil
    }
    utils.set_last_value(id, condition)
  }
  listen(state, callback)

  let initial = case when(value(state)) {
    True -> {
      utils.set_last_value(id, True)
      then
    }
    False -> {
      utils.set_last_value(id, False)
      []
    }
  }

  ParameterContainer(id, initial)
}

pub fn if2(
  state1: State(a),
  state2: State(b),
  when: fn(a, b) -> Bool,
  then: List(Parameter),
) -> Parameter {
  check(then)

  let id = utils.unique_id()

  let callback = fn(a, b) {
    let component =
      id
      |> get_component
    let condition = when(a, b)
    case condition, utils.get_last_value(id) {
      True, False -> {
        set_parameters(component, then)
        Nil
      }
      False, True -> {
        remove_parameters(component, then)
        Nil
      }
      _, _ -> Nil
    }
    utils.set_last_value(id, condition)
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
    True -> {
      utils.set_last_value(id, True)
      then
    }
    False -> {
      utils.set_last_value(id, False)
      []
    }
  }

  ParameterContainer(id, initial)
}

pub fn ternary1(
  state: State(a),
  when: fn(a) -> Bool,
  then: List(Parameter),
  otherwise: List(Parameter),
) -> Parameter {
  check(then)
  check(otherwise)

  let id = utils.unique_id()

  let callback = fn(a) {
    let component =
      id
      |> get_component
    let condition = when(a)
    case condition, utils.get_last_value(id) {
      True, False -> {
        component
        |> remove_parameters(otherwise)
        |> set_parameters(then)
        Nil
      }
      False, True -> {
        component
        |> remove_parameters(then)
        |> set_parameters(otherwise)
        Nil
      }
      _, _ -> Nil
    }
    utils.set_last_value(id, condition)
  }
  listen(state, callback)

  let initial = case when(value(state)) {
    True -> {
      utils.set_last_value(id, True)
      then
    }
    False -> {
      utils.set_last_value(id, False)
      otherwise
    }
  }

  ParameterContainer(id, initial)
}

pub fn utilize(state: State(a), do: fn(a) -> List(Parameter)) -> Parameter {
  let id = utils.unique_id()
  let callback = fn(a) {
    let component =
      id
      |> get_component
    let old = utils.get_last_value(id)
    let new = do(a)
    component
    |> remove_parameters(old)
    |> set_parameters(new)

    utils.set_last_value(id, new)
    Nil
  }
  listen(state, callback)

  let initial = do(value(state))
  utils.set_last_value(id, initial)
  ParameterContainer(id, initial)
}

fn check(params: List(Parameter)) -> Nil {
  use param <- list.each(params)
  case param {
    Attribute(_, _) -> Nil
    Listener(_, _) -> Nil
    _ -> panic as "Only attributes and listeners are allowed"
  }
}
