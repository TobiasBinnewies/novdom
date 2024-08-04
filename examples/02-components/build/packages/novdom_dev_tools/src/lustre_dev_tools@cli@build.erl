-module(lustre_dev_tools@cli@build).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([do_app/2, app/0]).

-spec get_module_interface(binary()) -> {ok, lustre_dev_tools@project:module_()} |
    {error, lustre_dev_tools@error:error()}.
get_module_interface(Module_path) ->
    _pipe = lustre_dev_tools@project:interface(),
    gleam@result:then(
        _pipe,
        fun(Interface) ->
            _pipe@1 = gleam@dict:get(erlang:element(4, Interface), Module_path),
            gleam@result:replace_error(_pipe@1, {module_missing, Module_path})
        end
    ).

-spec check_main_function(binary(), lustre_dev_tools@project:module_()) -> {ok,
        nil} |
    {error, lustre_dev_tools@error:error()}.
check_main_function(Module_path, Module) ->
    case gleam@dict:has_key(erlang:element(3, Module), <<"main"/utf8>>) of
        true ->
            {ok, nil};

        false ->
            {error, {main_missing, Module_path}}
    end.

-spec write_html(binary(), binary()) -> {ok, nil} |
    {error, lustre_dev_tools@error:error()}.
write_html(Path, Source) ->
    _pipe = simplifile:write(Path, Source),
    gleam@result:map_error(
        _pipe,
        fun(_capture) -> {cannot_write_file, _capture, Path} end
    ).

-spec prepare_html(binary(), boolean()) -> lustre_dev_tools@cli:cli(nil).
prepare_html(Dir, Is_prod) ->
    Index = filepath:join(Dir, <<"index.html"/utf8>>),
    case simplifile_erl:is_file(Index) of
        {ok, true} ->
            lustre_dev_tools@cli:return(nil);

        {ok, false} ->
            lustre_dev_tools@cli:template(
                <<"index.html"/utf8>>,
                fun(Html) ->
                    lustre_dev_tools@cli:do(
                        lustre_dev_tools@cli:get_name(),
                        fun(App_name) ->
                            App_name@1 = case Is_prod of
                                true ->
                                    <<App_name/binary, ".min"/utf8>>;

                                false ->
                                    App_name
                            end,
                            Html@1 = gleam@string:replace(
                                Html,
                                <<"{app_name}"/utf8>>,
                                App_name@1
                            ),
                            lustre_dev_tools@cli:'try'(
                                write_html(Index, Html@1),
                                fun(_) -> lustre_dev_tools@cli:return(nil) end
                            )
                        end
                    )
                end
            );

        {error, _} ->
            lustre_dev_tools@cli:template(
                <<"index.html"/utf8>>,
                fun(Html) ->
                    lustre_dev_tools@cli:do(
                        lustre_dev_tools@cli:get_name(),
                        fun(App_name) ->
                            App_name@1 = case Is_prod of
                                true ->
                                    <<App_name/binary, ".min"/utf8>>;

                                false ->
                                    App_name
                            end,
                            Html@1 = gleam@string:replace(
                                Html,
                                <<"{app_name}"/utf8>>,
                                App_name@1
                            ),
                            lustre_dev_tools@cli:'try'(
                                write_html(Index, Html@1),
                                fun(_) -> lustre_dev_tools@cli:return(nil) end
                            )
                        end
                    )
                end
            )
    end.

-spec bundle(binary(), binary(), binary(), boolean()) -> lustre_dev_tools@cli:cli(nil).
bundle(Entry, Tempdir, Outfile, Is_prod) ->
    Entryfile = filepath:join(Tempdir, <<"entry.mjs"/utf8>>),
    _assert_subject = simplifile:write(Entryfile, Entry),
    {ok, _} = case _assert_subject of
        {ok, _} -> _assert_subject;
        _assert_fail ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail,
                        module => <<"lustre_dev_tools/cli/build"/utf8>>,
                        function => <<"bundle"/utf8>>,
                        line => 177})
    end,
    lustre_dev_tools@cli:'try'(
        lustre_dev_tools@project:build(),
        fun(_) -> case Is_prod of
                true ->
                    lustre_dev_tools@cli:do(
                        lustre_dev_tools@esbuild:bundle(
                            Entryfile,
                            Outfile,
                            true
                        ),
                        fun(_) -> lustre_dev_tools@cli:return(nil) end
                    );

                false ->
                    Entry@1 = gleam@string:replace(
                        Entry,
                        <<"/dev"/utf8>>,
                        <<""/utf8>>
                    ),
                    _assert_subject@1 = simplifile:write(Outfile, Entry@1),
                    {ok, _} = case _assert_subject@1 of
                        {ok, _} -> _assert_subject@1;
                        _assert_fail@1 ->
                            erlang:error(#{gleam_error => let_assert,
                                        message => <<"Assertion pattern match failed"/utf8>>,
                                        value => _assert_fail@1,
                                        module => <<"lustre_dev_tools/cli/build"/utf8>>,
                                        function => <<"bundle"/utf8>>,
                                        line => 188})
                    end,
                    Used_node_modules = lustre_dev_tools@project:all_node_modules(
                        
                    ),
                    lustre_dev_tools@cli:do(
                        lustre_dev_tools@esbuild:bundle_node_modules(
                            Used_node_modules,
                            lustre_dev_tools@project:build_dir(false)
                        ),
                        fun(_) ->
                            lustre_dev_tools@cli:success(
                                <<<<"Bundle produced at `"/utf8,
                                        Outfile/binary>>/binary,
                                    "`"/utf8>>,
                                fun() -> lustre_dev_tools@cli:return(nil) end
                            )
                        end
                    )
            end end
    ).

-spec exec_tailwind(binary(), list(binary())) -> {ok, binary()} |
    {error, lustre_dev_tools@error:error()}.
exec_tailwind(Root, Options) ->
    _pipe = lustre_dev_tools_ffi:exec(
        <<"./build/.lustre/bin/tailwind"/utf8>>,
        Options,
        Root
    ),
    gleam@result:map_error(
        _pipe,
        fun(Pair) -> {bundle_error, erlang:element(2, Pair)} end
    ).

-spec is_string_type(gleam@package_interface:type()) -> boolean().
is_string_type(T) ->
    case T of
        {named, <<"String"/utf8>>, <<""/utf8>>, <<"gleam"/utf8>>, []} ->
            true;

        _ ->
            false
    end.

-spec is_nil_type(gleam@package_interface:type()) -> boolean().
is_nil_type(T) ->
    case T of
        {named, <<"Nil"/utf8>>, <<""/utf8>>, <<"gleam"/utf8>>, []} ->
            true;

        _ ->
            false
    end.

-spec is_type_variable(gleam@package_interface:type()) -> boolean().
is_type_variable(T) ->
    case T of
        {variable, _} ->
            true;

        _ ->
            false
    end.

-spec is_compatible_app_type(gleam@package_interface:type()) -> boolean().
is_compatible_app_type(T) ->
    case T of
        {named,
            <<"App"/utf8>>,
            <<"lustre"/utf8>>,
            <<"lustre"/utf8>>,
            [Flags | _]} ->
            is_nil_type(Flags) orelse is_type_variable(Flags);

        _ ->
            false
    end.

-spec is_reserved_keyword(binary()) -> boolean().
is_reserved_keyword(Name) ->
    case Name of
        <<"await"/utf8>> ->
            true;

        <<"arguments"/utf8>> ->
            true;

        <<"break"/utf8>> ->
            true;

        <<"case"/utf8>> ->
            true;

        <<"catch"/utf8>> ->
            true;

        <<"class"/utf8>> ->
            true;

        <<"const"/utf8>> ->
            true;

        <<"continue"/utf8>> ->
            true;

        <<"debugger"/utf8>> ->
            true;

        <<"default"/utf8>> ->
            true;

        <<"delete"/utf8>> ->
            true;

        <<"do"/utf8>> ->
            true;

        <<"else"/utf8>> ->
            true;

        <<"enum"/utf8>> ->
            true;

        <<"export"/utf8>> ->
            true;

        <<"extends"/utf8>> ->
            true;

        <<"eval"/utf8>> ->
            true;

        <<"false"/utf8>> ->
            true;

        <<"finally"/utf8>> ->
            true;

        <<"for"/utf8>> ->
            true;

        <<"function"/utf8>> ->
            true;

        <<"if"/utf8>> ->
            true;

        <<"implements"/utf8>> ->
            true;

        <<"import"/utf8>> ->
            true;

        <<"in"/utf8>> ->
            true;

        <<"instanceof"/utf8>> ->
            true;

        <<"interface"/utf8>> ->
            true;

        <<"let"/utf8>> ->
            true;

        <<"new"/utf8>> ->
            true;

        <<"null"/utf8>> ->
            true;

        <<"package"/utf8>> ->
            true;

        <<"private"/utf8>> ->
            true;

        <<"protected"/utf8>> ->
            true;

        <<"public"/utf8>> ->
            true;

        <<"return"/utf8>> ->
            true;

        <<"static"/utf8>> ->
            true;

        <<"super"/utf8>> ->
            true;

        <<"switch"/utf8>> ->
            true;

        <<"this"/utf8>> ->
            true;

        <<"throw"/utf8>> ->
            true;

        <<"true"/utf8>> ->
            true;

        <<"try"/utf8>> ->
            true;

        <<"typeof"/utf8>> ->
            true;

        <<"var"/utf8>> ->
            true;

        <<"void"/utf8>> ->
            true;

        <<"while"/utf8>> ->
            true;

        <<"with"/utf8>> ->
            true;

        <<"yield"/utf8>> ->
            true;

        <<"undefined"/utf8>> ->
            true;

        <<"then"/utf8>> ->
            true;

        _ ->
            false
    end.

-spec importable_name(binary()) -> binary().
importable_name(Identifier) ->
    case is_reserved_keyword(Identifier) of
        true ->
            <<Identifier/binary, "$"/utf8>>;

        false ->
            Identifier
    end.

-spec bundle_tailwind(binary(), binary(), binary(), boolean()) -> lustre_dev_tools@cli:cli(nil).
bundle_tailwind(Entry, Tempdir, Outfile, Is_prod) ->
    Root = lustre_dev_tools@project:root(),
    Tailwind_config_file = filepath:join(Root, <<"tailwind.config.js"/utf8>>),
    Has_tailwind_config = begin
        _pipe = simplifile_erl:is_file(Tailwind_config_file),
        gleam@result:unwrap(_pipe, false)
    end,
    gleam@bool:guard(
        not Has_tailwind_config,
        lustre_dev_tools@cli:return(nil),
        fun() ->
            lustre_dev_tools@cli:do(
                lustre_dev_tools@tailwind:setup(
                    lustre_dev_tools_ffi:get_os(),
                    lustre_dev_tools_ffi:get_cpu()
                ),
                fun(_) ->
                    lustre_dev_tools@cli:log(
                        <<"Bundling with Tailwind"/utf8>>,
                        fun() ->
                            Default_entryfile = filepath:join(
                                Tempdir,
                                <<"entry.css"/utf8>>
                            ),
                            lustre_dev_tools@cli:do(
                                lustre_dev_tools@cli:get_string(
                                    <<"tailwind-entry"/utf8>>,
                                    Default_entryfile,
                                    [<<"build"/utf8>>],
                                    fun(_capture) ->
                                        glint:get_flag(
                                            _capture,
                                            lustre_dev_tools@cli@flag:tailwind_entry(
                                                
                                            )
                                        )
                                    end
                                ),
                                fun(Entryfile) ->
                                    _assert_subject = case Entryfile =:= Default_entryfile of
                                        true ->
                                            simplifile:write(Entryfile, Entry);

                                        false ->
                                            {ok, nil}
                                    end,
                                    {ok, _} = case _assert_subject of
                                        {ok, _} -> _assert_subject;
                                        _assert_fail ->
                                            erlang:error(
                                                    #{gleam_error => let_assert,
                                                        message => <<"Assertion pattern match failed"/utf8>>,
                                                        value => _assert_fail,
                                                        module => <<"lustre_dev_tools/cli/build"/utf8>>,
                                                        function => <<"bundle_tailwind"/utf8>>,
                                                        line => 228}
                                                )
                                    end,
                                    Flags = [<<"--input="/utf8,
                                            Entryfile/binary>>,
                                        <<"--output="/utf8, Outfile/binary>>],
                                    Options = case Is_prod of
                                        true ->
                                            [<<"--minify"/utf8>> | Flags];

                                        false ->
                                            Flags
                                    end,
                                    lustre_dev_tools@cli:'try'(
                                        exec_tailwind(Root, Options),
                                        fun(_) ->
                                            lustre_dev_tools@cli:success(
                                                <<<<"Bundle produced at `"/utf8,
                                                        Outfile/binary>>/binary,
                                                    "`"/utf8>>,
                                                fun() ->
                                                    lustre_dev_tools@cli:return(
                                                        nil
                                                    )
                                                end
                                            )
                                        end
                                    )
                                end
                            )
                        end
                    )
                end
            )
        end
    ).

-spec do_app(boolean(), boolean()) -> lustre_dev_tools@cli:cli(nil).
do_app(Is_prod, Detect_tailwind) ->
    lustre_dev_tools@cli:log(
        <<"Building your project"/utf8>>,
        fun() ->
            lustre_dev_tools@cli:do(
                lustre_dev_tools@cli:get_name(),
                fun(Project_name) ->
                    lustre_dev_tools@cli:success(
                        <<"Project compiled successfully"/utf8>>,
                        fun() ->
                            lustre_dev_tools@cli:log(
                                <<"Checking if I can bundle your application"/utf8>>,
                                fun() ->
                                    lustre_dev_tools@cli:'try'(
                                        get_module_interface(Project_name),
                                        fun(Module) ->
                                            lustre_dev_tools@cli:'try'(
                                                check_main_function(
                                                    Project_name,
                                                    Module
                                                ),
                                                fun(_) ->
                                                    lustre_dev_tools@cli:log(
                                                        <<"Creating the bundle entry file"/utf8>>,
                                                        fun() ->
                                                            Root = lustre_dev_tools@project:root(
                                                                
                                                            ),
                                                            Tempdir = filepath:join(
                                                                Root,
                                                                <<"build/.lustre"/utf8>>
                                                            ),
                                                            Default_outdir = lustre_dev_tools@project:build_dir(
                                                                Is_prod
                                                            ),
                                                            lustre_dev_tools@cli:do(
                                                                lustre_dev_tools@cli:get_string(
                                                                    <<"outdir"/utf8>>,
                                                                    Default_outdir,
                                                                    [<<"build"/utf8>>],
                                                                    fun(
                                                                        _capture
                                                                    ) ->
                                                                        glint:get_flag(
                                                                            _capture,
                                                                            lustre_dev_tools@cli@flag:outdir(
                                                                                
                                                                            )
                                                                        )
                                                                    end
                                                                ),
                                                                fun(Outdir) ->
                                                                    _ = simplifile:create_directory_all(
                                                                        Tempdir
                                                                    ),
                                                                    _ = simplifile:create_directory_all(
                                                                        Outdir
                                                                    ),
                                                                    lustre_dev_tools@cli:do(
                                                                        prepare_html(
                                                                            Outdir,
                                                                            Is_prod
                                                                        ),
                                                                        fun(_) ->
                                                                            lustre_dev_tools@cli:template(
                                                                                <<"entry-with-main.mjs"/utf8>>,
                                                                                fun(
                                                                                    Template
                                                                                ) ->
                                                                                    Entry = gleam@string:replace(
                                                                                        Template,
                                                                                        <<"{app_name}"/utf8>>,
                                                                                        Project_name
                                                                                    ),
                                                                                    Entryfile = filepath:join(
                                                                                        Tempdir,
                                                                                        <<"entry.mjs"/utf8>>
                                                                                    ),
                                                                                    lustre_dev_tools@cli:do(
                                                                                        lustre_dev_tools@cli:get_string(
                                                                                            <<"ext"/utf8>>,
                                                                                            <<"mjs"/utf8>>,
                                                                                            [<<"build"/utf8>>],
                                                                                            fun(
                                                                                                _capture@1
                                                                                            ) ->
                                                                                                glint:get_flag(
                                                                                                    _capture@1,
                                                                                                    lustre_dev_tools@cli@flag:ext(
                                                                                                        
                                                                                                    )
                                                                                                )
                                                                                            end
                                                                                        ),
                                                                                        fun(
                                                                                            Ext
                                                                                        ) ->
                                                                                            Ext@1 = case Is_prod of
                                                                                                true ->
                                                                                                    <<".min."/utf8,
                                                                                                        Ext/binary>>;

                                                                                                false ->
                                                                                                    <<"."/utf8,
                                                                                                        Ext/binary>>
                                                                                            end,
                                                                                            Outfile = begin
                                                                                                _pipe = Project_name,
                                                                                                _pipe@1 = gleam@string:append(
                                                                                                    _pipe,
                                                                                                    Ext@1
                                                                                                ),
                                                                                                filepath:join(
                                                                                                    Outdir,
                                                                                                    _pipe@1
                                                                                                )
                                                                                            end,
                                                                                            _assert_subject = simplifile:write(
                                                                                                Entryfile,
                                                                                                Entry
                                                                                            ),
                                                                                            {ok,
                                                                                                _} = case _assert_subject of
                                                                                                {ok,
                                                                                                    _} -> _assert_subject;
                                                                                                _assert_fail ->
                                                                                                    erlang:error(
                                                                                                            #{gleam_error => let_assert,
                                                                                                                message => <<"Assertion pattern match failed"/utf8>>,
                                                                                                                value => _assert_fail,
                                                                                                                module => <<"lustre_dev_tools/cli/build"/utf8>>,
                                                                                                                function => <<"do_app"/utf8>>,
                                                                                                                line => 111}
                                                                                                        )
                                                                                            end,
                                                                                            lustre_dev_tools@cli:do(
                                                                                                bundle(
                                                                                                    Entry,
                                                                                                    Tempdir,
                                                                                                    Outfile,
                                                                                                    Is_prod
                                                                                                ),
                                                                                                fun(
                                                                                                    _
                                                                                                ) ->
                                                                                                    gleam@bool:guard(
                                                                                                        not Detect_tailwind,
                                                                                                        lustre_dev_tools@cli:return(
                                                                                                            nil
                                                                                                        ),
                                                                                                        fun(
                                                                                                            
                                                                                                        ) ->
                                                                                                            lustre_dev_tools@cli:template(
                                                                                                                <<"entry.css"/utf8>>,
                                                                                                                fun(
                                                                                                                    Entry@1
                                                                                                                ) ->
                                                                                                                    Outfile@1 = begin
                                                                                                                        _pipe@2 = filepath:strip_extension(
                                                                                                                            Outfile
                                                                                                                        ),
                                                                                                                        gleam@string:append(
                                                                                                                            _pipe@2,
                                                                                                                            <<".css"/utf8>>
                                                                                                                        )
                                                                                                                    end,
                                                                                                                    lustre_dev_tools@cli:do(
                                                                                                                        bundle_tailwind(
                                                                                                                            Entry@1,
                                                                                                                            Tempdir,
                                                                                                                            Outfile@1,
                                                                                                                            Is_prod
                                                                                                                        ),
                                                                                                                        fun(
                                                                                                                            _
                                                                                                                        ) ->
                                                                                                                            lustre_dev_tools@cli:return(
                                                                                                                                nil
                                                                                                                            )
                                                                                                                        end
                                                                                                                    )
                                                                                                                end
                                                                                                            )
                                                                                                        end
                                                                                                    )
                                                                                                end
                                                                                            )
                                                                                        end
                                                                                    )
                                                                                end
                                                                            )
                                                                        end
                                                                    )
                                                                end
                                                            )
                                                        end
                                                    )
                                                end
                                            )
                                        end
                                    )
                                end
                            )
                        end
                    )
                end
            )
        end
    ).

-spec app() -> glint:command(nil).
app() ->
    Description = <<"
Build and bundle an entire Lustre application. The generated JavaScript module
calls your app's `main` function on page load and can be included in any Web
page without Gleam or Lustre being present.


This is different from using `gleam build` directly because it produces a single
JavaScript module for you to host or distribute.
"/utf8>>,
    glint:command_help(
        Description,
        fun() ->
            glint:unnamed_args(
                {eq_args, 0},
                fun() ->
                    glint:flag(
                        lustre_dev_tools@cli@flag:prod(),
                        fun(Is_prod) ->
                            glint:flag(
                                lustre_dev_tools@cli@flag:detect_tailwind(),
                                fun(Detect_tailwind) ->
                                    glint:flag(
                                        lustre_dev_tools@cli@flag:tailwind_entry(
                                            
                                        ),
                                        fun(_) ->
                                            glint:flag(
                                                lustre_dev_tools@cli@flag:outdir(
                                                    
                                                ),
                                                fun(_) ->
                                                    glint:flag(
                                                        lustre_dev_tools@cli@flag:ext(
                                                            
                                                        ),
                                                        fun(_) ->
                                                            glint:command(
                                                                fun(_, _, Flags) ->
                                                                    Script = (lustre_dev_tools@cli:do(
                                                                        lustre_dev_tools@cli:get_bool(
                                                                            <<"prod"/utf8>>,
                                                                            false,
                                                                            [<<"build"/utf8>>],
                                                                            Is_prod
                                                                        ),
                                                                        fun(
                                                                            Is_prod@1
                                                                        ) ->
                                                                            lustre_dev_tools@cli:do(
                                                                                lustre_dev_tools@cli:get_bool(
                                                                                    <<"detect-tailwind"/utf8>>,
                                                                                    true,
                                                                                    [<<"build"/utf8>>],
                                                                                    Detect_tailwind
                                                                                ),
                                                                                fun(
                                                                                    Detect_tailwind@1
                                                                                ) ->
                                                                                    do_app(
                                                                                        Is_prod@1,
                                                                                        Detect_tailwind@1
                                                                                    )
                                                                                end
                                                                            )
                                                                        end
                                                                    )),
                                                                    case lustre_dev_tools@cli:run(
                                                                        Script,
                                                                        Flags
                                                                    ) of
                                                                        {ok, _} ->
                                                                            nil;

                                                                        {error,
                                                                            Error} ->
                                                                            lustre_dev_tools@error:explain(
                                                                                Error
                                                                            )
                                                                    end
                                                                end
                                                            )
                                                        end
                                                    )
                                                end
                                            )
                                        end
                                    )
                                end
                            )
                        end
                    )
                end
            )
        end
    ).
