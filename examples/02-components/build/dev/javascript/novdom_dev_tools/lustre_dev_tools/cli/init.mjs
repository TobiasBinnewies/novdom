import * as $result from "../../../gleam_stdlib/gleam/result.mjs";
import * as $glint from "../../../glint/glint.mjs";
import * as $cli from "../../lustre_dev_tools/cli.mjs";
import * as $flag from "../../lustre_dev_tools/cli/flag.mjs";
import * as $cmd from "../../lustre_dev_tools/cmd.mjs";
import * as $error from "../../lustre_dev_tools/error.mjs";
import { DependencyInstallationError } from "../../lustre_dev_tools/error.mjs";
import * as $project from "../../lustre_dev_tools/project.mjs";
import { needed_dev_node_modules, needed_node_modules } from "../../lustre_dev_tools/project.mjs";

function dev_flag(pm) {
  if (pm === "yarn") {
    return "--dev";
  } else if (pm === "bun") {
    return "--dev";
  } else {
    return "--save-dev";
  }
}

function install_command(pm) {
  if (pm === "yarn") {
    return "add";
  } else {
    return "install";
  }
}
