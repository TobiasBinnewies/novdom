import * as $filepath from "../../filepath/filepath.mjs";
import * as $process from "../../gleam_erlang/gleam/erlang/process.mjs";
import * as $request from "../../gleam_http/gleam/http/request.mjs";
import { Request } from "../../gleam_http/gleam/http/request.mjs";
import * as $response from "../../gleam_http/gleam/http/response.mjs";
import * as $bool from "../../gleam_stdlib/gleam/bool.mjs";
import * as $io from "../../gleam_stdlib/gleam/io.mjs";
import * as $option from "../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../gleam_stdlib/gleam/option.mjs";
import * as $regex from "../../gleam_stdlib/gleam/regex.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import * as $string_builder from "../../gleam_stdlib/gleam/string_builder.mjs";
import * as $mist from "../../mist/mist.mjs";
import * as $simplifile from "../../simplifile/simplifile.mjs";
import * as $wisp from "../../wisp/wisp.mjs";
import { makeError } from "../gleam.mjs";
import * as $cli from "../lustre_dev_tools/cli.mjs";
import { do$, try$ } from "../lustre_dev_tools/cli.mjs";
import * as $cmd from "../lustre_dev_tools/cmd.mjs";
import * as $error from "../lustre_dev_tools/error.mjs";
import { CannotStartDevServer } from "../lustre_dev_tools/error.mjs";
import * as $project from "../lustre_dev_tools/project.mjs";
import * as $live_reload from "../lustre_dev_tools/server/live_reload.mjs";
import * as $proxy from "../lustre_dev_tools/server/proxy.mjs";

function src_handler(req, src_root) {
  let src = (() => {
    let _pipe = req;
    let _pipe$1 = $wisp.path_segments(_pipe);
    let _pipe$2 = $string.join(_pipe$1, "/");
    return ((_capture) => { return $filepath.join(src_root, _capture); })(
      _pipe$2,
    );
  })();
  let $ = $simplifile.is_file(src);
  if ($.isOk() && !$[0]) {
    return $wisp.response(404);
  } else if (!$.isOk()) {
    return $wisp.response(404);
  } else {
    let $1 = $simplifile.read(src);
    if (!$1.isOk()) {
      throw makeError(
        "assignment_no_match",
        "lustre_dev_tools/server",
        94,
        "src_handler",
        "Assignment pattern did not match",
        { value: $1 }
      )
    }
    let content = $1[0];
    let content$1 = $project.replace_node_modules_with_relative_path(content);
    let _pipe = $wisp.response(200);
    let _pipe$1 = $wisp.set_header(
      _pipe,
      "content-type",
      "text/javascript; charset=utf-8",
    );
    return $wisp.string_body(_pipe$1, content$1);
  }
}
