-module(lustre_dev_tools@cli@init).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([init/1, command/0]).

-spec dev_flag(binary()) -> binary().
dev_flag(Pm) ->
    case Pm of
        <<"yarn"/utf8>> ->
            <<"--dev"/utf8>>;

        <<"bun"/utf8>> ->
            <<"--dev"/utf8>>;

        _ ->
            <<"--save-dev"/utf8>>
    end.

-spec install_command(binary()) -> binary().
install_command(Pm) ->
    case Pm of
        <<"yarn"/utf8>> ->
            <<"add"/utf8>>;

        _ ->
            <<"install"/utf8>>
    end.

-spec do_install(binary(), binary(), list(binary()), list(binary())) -> lustre_dev_tools@cli:cli(nil).
do_install(Pm, Root, Dependencies, Dev_dependencies) ->
    Install_dev_result = begin
        _pipe = lustre_dev_tools_ffi:exec(
            Pm,
            [install_command(Pm), dev_flag(Pm) | Dev_dependencies],
            Root
        ),
        gleam@result:map_error(
            _pipe,
            fun(Pair) ->
                {dependency_installation_error, erlang:element(2, Pair), Pm}
            end
        )
    end,
    lustre_dev_tools@cli:'try'(
        Install_dev_result,
        fun(_) ->
            Install_result = begin
                _pipe@1 = lustre_dev_tools_ffi:exec(
                    Pm,
                    [install_command(Pm) | Dependencies],
                    Root
                ),
                gleam@result:map_error(
                    _pipe@1,
                    fun(Pair@1) ->
                        {dependency_installation_error,
                            erlang:element(2, Pair@1),
                            Pm}
                    end
                )
            end,
            lustre_dev_tools@cli:'try'(
                Install_result,
                fun(_) ->
                    lustre_dev_tools@cli:success(
                        <<"Dependencies installed!"/utf8>>,
                        fun() -> lustre_dev_tools@cli:return(nil) end
                    )
                end
            )
        end
    ).

-spec init(binary()) -> lustre_dev_tools@cli:cli(nil).
init(Pm) ->
    lustre_dev_tools@cli:log(
        <<"Installing JavaScript dependencies"/utf8>>,
        fun() ->
            Root = lustre_dev_tools@project:root(),
            case lustre_dev_tools@project:all_node_modules_installed() of
                true ->
                    lustre_dev_tools@cli:success(
                        <<"All dependencies already installed!"/utf8>>,
                        fun() -> lustre_dev_tools@cli:return(nil) end
                    );

                false ->
                    do_install(
                        Pm,
                        Root,
                        [<<"quill"/utf8>>, <<"tailwind-merge"/utf8>>],
                        [<<"jsdom"/utf8>>]
                    )
            end
        end
    ).

-spec command() -> glint:command(nil).
command() ->
    Description = <<"Installing JavaScript dependencies & adding tailwind"/utf8>>,
    glint:command_help(
        Description,
        fun() ->
            glint:unnamed_args(
                {eq_args, 0},
                fun() ->
                    glint:flag(
                        lustre_dev_tools@cli@flag:package_manager(),
                        fun(Pm) ->
                            glint:command(
                                fun(_, _, Flags) ->
                                    Script = (lustre_dev_tools@cli:do(
                                        lustre_dev_tools@cli:get_string(
                                            <<"package-manager"/utf8>>,
                                            <<"bun"/utf8>>,
                                            [<<"init"/utf8>>],
                                            Pm
                                        ),
                                        fun(Pm@1) -> init(Pm@1) end
                                    )),
                                    case lustre_dev_tools@cli:run(Script, Flags) of
                                        {ok, _} ->
                                            nil;

                                        {error, Error} ->
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
    ).
