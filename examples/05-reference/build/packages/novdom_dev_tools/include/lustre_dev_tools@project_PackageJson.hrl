-record(package_json, {
    dependencies :: gleam@option:option(gleam@dict:dict(binary(), binary())),
    dev_dependencies :: gleam@option:option(gleam@dict:dict(binary(), binary()))
}).
