// IMPORTS ---------------------------------------------------------------------

import glint.{type Command}
import lustre_dev_tools/cli.{type Cli, do}
import lustre_dev_tools/cli/build
import lustre_dev_tools/cli/flag
import lustre_dev_tools/error.{type Error}
import lustre_dev_tools/project
import lustre_dev_tools/server

// COMMANDS --------------------------------------------------------------------

pub fn run() -> Command(Nil) {
  let description =
    "
Start a development server for your Lustre project. This command will compile your
application and serve it on a local server. If your application's `main` function
returns a compatible `App`, this will generate the necessary code to start it.
Otherwise, your `main` function will be used as the entry point.


This development server does *not* currently watch your files for changes.
Watchexec is a popular tool you can use to restart the server when files change.
    "
  use <- glint.command_help(description)
  use <- glint.unnamed_args(glint.EqArgs(0))
  use port <- glint.flag(flag.port())
  use _proxy_from <- glint.flag(flag.proxy_from())
  use _proxy_to <- glint.flag(flag.proxy_to())
  use detect_tailwind <- glint.flag(flag.detect_tailwind())
  use _tailwind_entry <- glint.flag(flag.tailwind_entry())
  use _, _, flags <- glint.command()
  let script = {
    use port <- do(cli.get_int("port", 1234, ["start"], port))
    use detect_tailwind <- do(cli.get_bool(
      "detect_tailwind",
      True,
      ["build"],
      detect_tailwind,
    ))

    use _ <- do(check_otp_version())
    use _ <- do(build.do_app(False, detect_tailwind))
    use _ <- do(server.start(port))

    cli.return(Nil)
  }

  case cli.run(script, flags) {
    Ok(_) -> Nil
    Error(error) -> error.explain(error)
  }
}

// STEPS -----------------------------------------------------------------------

fn check_otp_version() -> Cli(Nil) {
  use <- cli.log("Checking OTP version")
  let version = project.otp_version()
  case version <= 25 {
    False -> cli.return(Nil)
    True -> cli.throw(error.OtpTooOld(version))
  }
}
