import novdom/internals/parameter.{type Parameter, Modifier}

pub fn onrender(callback: fn() -> List(Parameter)) -> Parameter {
  let callback = fn(_) { callback() }
  Modifier("onrender", callback)
}

pub fn offrender(callback: fn(fn() -> Nil) -> List(Parameter)) -> Parameter {
  Modifier("offrender", callback)
}
