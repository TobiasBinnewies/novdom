import * as $filepath from "../../filepath/filepath.mjs";
import * as $json from "../../gleam_json/gleam/json.mjs";
import * as $package_interface from "../../gleam_package_interface/gleam/package_interface.mjs";
import { Fn, Named, Tuple, Variable } from "../../gleam_package_interface/gleam/package_interface.mjs";
import * as $bool from "../../gleam_stdlib/gleam/bool.mjs";
import * as $dict from "../../gleam_stdlib/gleam/dict.mjs";
import * as $dynamic from "../../gleam_stdlib/gleam/dynamic.mjs";
import { DecodeError } from "../../gleam_stdlib/gleam/dynamic.mjs";
import * as $int from "../../gleam_stdlib/gleam/int.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../gleam_stdlib/gleam/option.mjs";
import { Some, None } from "../../gleam_stdlib/gleam/option.mjs";
import * as $pair from "../../gleam_stdlib/gleam/pair.mjs";
import * as $regex from "../../gleam_stdlib/gleam/regex.mjs";
import { Match } from "../../gleam_stdlib/gleam/regex.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import * as $set from "../../gleam_stdlib/gleam/set.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import * as $simplifile from "../../simplifile/simplifile.mjs";
import * as $tom from "../../tom/tom.mjs";
import { Ok, toList, CustomType as $CustomType, makeError } from "../gleam.mjs";
import * as $cmd from "../lustre_dev_tools/cmd.mjs";
import * as $error from "../lustre_dev_tools/error.mjs";
import { BuildError } from "../lustre_dev_tools/error.mjs";

export class Config extends $CustomType {
  constructor(name, version, toml) {
    super();
    this.name = name;
    this.version = version;
    this.toml = toml;
  }
}

export class Interface extends $CustomType {
  constructor(name, version, modules) {
    super();
    this.name = name;
    this.version = version;
    this.modules = modules;
  }
}

export class Module extends $CustomType {
  constructor(constants, functions) {
    super();
    this.constants = constants;
    this.functions = functions;
  }
}

export class Function extends $CustomType {
  constructor(parameters, return$) {
    super();
    this.parameters = parameters;
    this.return = return$;
  }
}

export class PackageJson extends $CustomType {
  constructor(dependencies, dev_dependencies) {
    super();
    this.dependencies = dependencies;
    this.dev_dependencies = dev_dependencies;
  }
}

function check_if_all_dependencies_installed(installed, needed) {
  if (installed instanceof None) {
    return false;
  } else {
    let installed$1 = installed[0];
    return $list.all(
      needed,
      (dep) => { return $dict.has_key(installed$1, dep); },
    );
  }
}

function find_root(loop$path) {
  while (true) {
    let path = loop$path;
    let toml = $filepath.join(path, "gleam.toml");
    let $ = $simplifile.is_file(toml);
    if ($.isOk() && !$[0]) {
      loop$path = $filepath.join("..", path);
    } else if (!$.isOk()) {
      loop$path = $filepath.join("..", path);
    } else {
      return path;
    }
  }
}

export function root() {
  return find_root(".");
}

export function config() {
  let configuration_path = $filepath.join(root(), "gleam.toml");
  let $ = $simplifile.read(configuration_path);
  if (!$.isOk()) {
    throw makeError(
      "assignment_no_match",
      "lustre_dev_tools/project",
      122,
      "config",
      "Assignment pattern did not match",
      { value: $ }
    )
  }
  let configuration = $[0];
  let $1 = $tom.parse(configuration);
  if (!$1.isOk()) {
    throw makeError(
      "assignment_no_match",
      "lustre_dev_tools/project",
      123,
      "config",
      "Assignment pattern did not match",
      { value: $1 }
    )
  }
  let toml = $1[0];
  let $2 = $tom.get_string(toml, toList(["name"]));
  if (!$2.isOk()) {
    throw makeError(
      "assignment_no_match",
      "lustre_dev_tools/project",
      124,
      "config",
      "Assignment pattern did not match",
      { value: $2 }
    )
  }
  let name = $2[0];
  let $3 = $tom.get_string(toml, toList(["version"]));
  if (!$3.isOk()) {
    throw makeError(
      "assignment_no_match",
      "lustre_dev_tools/project",
      125,
      "config",
      "Assignment pattern did not match",
      { value: $3 }
    )
  }
  let version = $3[0];
  return new Ok(new Config(name, version, toml));
}

export function build_dir(is_prod) {
  if (is_prod) {
    return $filepath.join(root(), "dist");
  } else {
    return $filepath.join(root(), "build/dev/static");
  }
}

export function type_to_string(type_) {
  if (type_ instanceof Tuple) {
    let elements = type_.elements;
    let elements$1 = $list.map(elements, type_to_string);
    return ("#(" + $string.join(elements$1, ", ")) + ")";
  } else if (type_ instanceof Fn) {
    let params = type_.parameters;
    let return$ = type_.return;
    let params$1 = $list.map(params, type_to_string);
    let return$1 = type_to_string(return$);
    return (("fn(" + $string.join(params$1, ", ")) + ") -> ") + return$1;
  } else if (type_ instanceof Named && type_.parameters.hasLength(0)) {
    let name = type_.name;
    return name;
  } else if (type_ instanceof Named) {
    let name = type_.name;
    let params = type_.parameters;
    let params$1 = $list.map(params, type_to_string);
    return ((name + "(") + $string.join(params$1, ", ")) + ")";
  } else {
    let id = type_.id;
    return "a_" + $int.to_string(id);
  }
}

function is_js(file) {
  let $ = (() => {
    let _pipe = file;
    let _pipe$1 = $filepath.extension(_pipe);
    return $result.unwrap(_pipe$1, "");
  })();
  if ($ === "js") {
    return !(() => {
      let _pipe = file;
      let _pipe$1 = $filepath.base_name(_pipe);
      return $string.contains(_pipe$1, "test");
    })();
  } else if ($ === "mjs") {
    return !(() => {
      let _pipe = file;
      let _pipe$1 = $filepath.base_name(_pipe);
      return $string.contains(_pipe$1, "test");
    })();
  } else if ($ === "ts") {
    return !(() => {
      let _pipe = file;
      let _pipe$1 = $filepath.base_name(_pipe);
      return $string.contains(_pipe$1, "test");
    })();
  } else {
    return false;
  }
}

function node_modules_matches(src) {
  let $ = $regex.from_string("(?:from|import) (?:\"|')([\\w|-]*)(?:\"|')");
  if (!$.isOk()) {
    throw makeError(
      "assignment_no_match",
      "lustre_dev_tools/project",
      271,
      "node_modules_matches",
      "Assignment pattern did not match",
      { value: $ }
    )
  }
  let modules = $[0];
  return $regex.scan(modules, src);
}

export function replace_node_modules_with_relative_path(src) {
  let modules = node_modules_matches(src);
  let replacements = $list.map(
    modules,
    (module) => {
      if (
        !(module instanceof Match) ||
        !module.submatches.hasLength(1) ||
        !(module.submatches.head instanceof Some)
      ) {
        throw makeError(
          "assignment_no_match",
          "lustre_dev_tools/project",
          247,
          "",
          "Assignment pattern did not match",
          { value: module }
        )
      }
      let full = module.content;
      let name = module.submatches.head[0];
      let replacement = $string.replace(
        full,
        name,
        ("/modules/" + name) + ".mjs",
      );
      return [name, replacement];
    },
  );
  return $list.fold(
    replacements,
    src,
    (src, replacement) => {
      let $ = $regex.from_string(
        ("(?:from|import) (?:\"|')(" + replacement[0]) + ")(?:\"|')",
      );
      if (!$.isOk()) {
        throw makeError(
          "assignment_no_match",
          "lustre_dev_tools/project",
          254,
          "",
          "Assignment pattern did not match",
          { value: $ }
        )
      }
      let to_replace = $[0];
      return $regex.replace(to_replace, src, replacement[1]);
    },
  );
}

function used_node_modules(src) {
  let modules = node_modules_matches(src);
  return $list.map(
    modules,
    (module) => {
      if (
        !(module instanceof Match) ||
        !module.submatches.hasLength(1) ||
        !(module.submatches.head instanceof Some)
      ) {
        throw makeError(
          "assignment_no_match",
          "lustre_dev_tools/project",
          266,
          "",
          "Assignment pattern did not match",
          { value: module }
        )
      }
      let name = module.submatches.head[0];
      return name;
    },
  );
}

export function all_node_modules() {
  let src_dir = $filepath.join(root(), "build/dev/javascript");
  let $ = $simplifile.get_files(src_dir);
  if (!$.isOk()) {
    throw makeError(
      "assignment_no_match",
      "lustre_dev_tools/project",
      221,
      "all_node_modules",
      "Assignment pattern did not match",
      { value: $ }
    )
  }
  let files = $[0];
  let _pipe = $list.fold(
    files,
    $set.new$(),
    (modules, file) => {
      return $bool.guard(
        !is_js(file),
        modules,
        () => {
          let $1 = $simplifile.read(file);
          if (!$1.isOk()) {
            throw makeError(
              "assignment_no_match",
              "lustre_dev_tools/project",
              225,
              "",
              "Assignment pattern did not match",
              { value: $1 }
            )
          }
          let src = $1[0];
          let _pipe = used_node_modules(src);
          let _pipe$1 = $set.from_list(_pipe);
          return $set.union(_pipe$1, modules);
        },
      );
    },
  );
  return $set.to_list(_pipe);
}

function labelled_argument_decoder(dyn) {
  return $dynamic.field("type", $package_interface.type_decoder)(dyn);
}

function function_decoder(dyn) {
  return $dynamic.decode2(
    (var0, var1) => { return new Function(var0, var1); },
    $dynamic.field("parameters", $dynamic.list(labelled_argument_decoder)),
    $dynamic.field("return", $package_interface.type_decoder),
  )(dyn);
}

function string_dict(values) {
  return $dynamic.dict($dynamic.string, values);
}

function module_decoder(dyn) {
  return $dynamic.decode2(
    (var0, var1) => { return new Module(var0, var1); },
    $dynamic.field(
      "constants",
      string_dict($dynamic.field("type", $package_interface.type_decoder)),
    ),
    $dynamic.field("functions", string_dict(function_decoder)),
  )(dyn);
}

function interface_decoder(dyn) {
  return $dynamic.decode3(
    (var0, var1, var2) => { return new Interface(var0, var1, var2); },
    $dynamic.field("name", $dynamic.string),
    $dynamic.field("version", $dynamic.string),
    $dynamic.field("modules", string_dict(module_decoder)),
  )(dyn);
}

function package_json_decoder(dyn) {
  return $dynamic.decode2(
    (var0, var1) => { return new PackageJson(var0, var1); },
    $dynamic.optional_field("dependencies", string_dict($dynamic.string)),
    $dynamic.optional_field("devDependencies", string_dict($dynamic.string)),
  )(dyn);
}

export function package_json() {
  return $result.try$(
    $simplifile.read("package.json"),
    (json) => {
      let $ = $json.decode(json, package_json_decoder);
      if (!$.isOk()) {
        throw makeError(
          "assignment_no_match",
          "lustre_dev_tools/project",
          166,
          "",
          "Assignment pattern did not match",
          { value: $ }
        )
      }
      let package_json$1 = $[0];
      return new Ok(package_json$1);
    },
  );
}

export const needed_node_modules = toList(["quill", "tailwind-merge"]);

export const needed_dev_node_modules = toList(["jsdom"]);

export function all_node_modules_installed() {
  let $ = package_json();
  if (!$.isOk()) {
    return false;
  } else {
    let package_json$1 = $[0];
    let dependencies = package_json$1.dependencies;
    let dev_dependencies = package_json$1.dev_dependencies;
    let has_dependencies = check_if_all_dependencies_installed(
      dependencies,
      needed_node_modules,
    );
    let has_dev_dependencies = check_if_all_dependencies_installed(
      dev_dependencies,
      needed_dev_node_modules,
    );
    return has_dependencies && has_dev_dependencies;
  }
}
