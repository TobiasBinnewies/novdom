{application, novdom_dev_tools, [
    {vsn, "0.2.2"},
    {applications, [argv,
                    filepath,
                    fs,
                    gleam_community_ansi,
                    gleam_crypto,
                    gleam_erlang,
                    gleam_http,
                    gleam_httpc,
                    gleam_json,
                    gleam_otp,
                    gleam_package_interface,
                    gleam_stdlib,
                    glint,
                    glisten,
                    mist,
                    simplifile,
                    spinner,
                    term_size,
                    tom,
                    wisp]},
    {description, "Development Tooling and CLI for the novdom framework."},
    {modules, [lustre@dev,
               lustre_dev_tools@cli,
               lustre_dev_tools@cli@add,
               lustre_dev_tools@cli@build,
               lustre_dev_tools@cli@flag,
               lustre_dev_tools@cli@init,
               lustre_dev_tools@cli@start,
               lustre_dev_tools@cmd,
               lustre_dev_tools@error,
               lustre_dev_tools@esbuild,
               lustre_dev_tools@esbuild@preprocess,
               lustre_dev_tools@project,
               lustre_dev_tools@server,
               lustre_dev_tools@server@live_reload,
               lustre_dev_tools@server@proxy,
               lustre_dev_tools@tailwind,
               lustre_dev_tools@utils]},
    {registered, []}
]}.