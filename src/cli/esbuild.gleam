// import gleam/otp/actor
// import simplifile
// import glisten
// import gleam/dynamic.{type Dynamic}

// pub type Error {
//   BuildError(reason: String)
//   BundleError(reason: String)
//   CannotSetPermissions(reason: simplifile.FileError, path: String)
//   CannotStartDevServer(reason: glisten.StartError)
//   CannotStartFileWatcher(reason: actor.StartError)
//   CannotWriteFile(reason: simplifile.FileError, path: String)
//   ComponentMissing(module: String)
//   IncompleteProxy(missing: List(String))
//   InternalError(message: String)
//   InvalidProxyTarget(to: String)
//   MainBadAppType(module: String, flags: Type, model: Type, msg: Type)
//   MainMissing(module: String)
//   MainTakesAnArgument(module: String, got: Type)
//   ModuleMissing(module: String)
//   NameIncorrectType(module: String, got: Type)
//   NameMissing(module: String)
//   NetworkError(Dynamic)
//   TemplateMissing(name: String, reason: simplifile.FileError)
//   UnknownPlatform(binary: String, os: String, cpu: String)
//   UnzipError(Dynamic)
// }

// fn build_project() -> Result(Nil, Error) {
//     exec(run: "gleam", in: ".", with: ["build", "--target", "javascript"])
//   |> result.map_error(fn(err) { BuildError(pair.second(err)) })
//   |> result.replace(Nil)
// }

// // EXTERNALS -------------------------------------------------------------------

// ///
// ///
// @external(erlang, "lustre_dev_tools_ffi", "exec")
// pub fn exec(
//   run command: String,
//   with args: List(String),
//   in in: String,
// ) -> Result(String, #(Int, String))

// ///
// ///
// @external(erlang, "lustre_dev_tools_ffi", "get_cwd")
// pub fn cwd() -> Result(String, Dynamic)
