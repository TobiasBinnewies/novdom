-module(lustre_dev_tools@server).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([start/1]).

-spec src_handler(gleam@http@request:request(wisp:connection()), binary()) -> gleam@http@response:response(wisp:body()).
src_handler(Req, Src_root) ->
    Src = begin
        _pipe = Req,
        _pipe@1 = fun gleam@http@request:path_segments/1(_pipe),
        _pipe@2 = gleam@string:join(_pipe@1, <<"/"/utf8>>),
        filepath:join(Src_root, _pipe@2)
    end,
    case simplifile_erl:is_file(Src) of
        {ok, false} ->
            wisp:response(404);

        {error, _} ->
            wisp:response(404);

        {ok, true} ->
            _assert_subject = simplifile:read(Src),
            {ok, Content} = case _assert_subject of
                {ok, _} -> _assert_subject;
                _assert_fail ->
                    erlang:error(#{gleam_error => let_assert,
                                message => <<"Assertion pattern match failed"/utf8>>,
                                value => _assert_fail,
                                module => <<"lustre_dev_tools/server"/utf8>>,
                                function => <<"src_handler"/utf8>>,
                                line => 94})
            end,
            Content@1 = lustre_dev_tools@project:replace_node_modules_with_relative_path(
                Content
            ),
            _pipe@3 = wisp:response(200),
            _pipe@4 = fun gleam@http@response:set_header/3(
                _pipe@3,
                <<"content-type"/utf8>>,
                <<"text/javascript; charset=utf-8"/utf8>>
            ),
            wisp:string_body(_pipe@4, Content@1)
    end.

-spec inject_live_reload(
    gleam@http@request:request(wisp:connection()),
    binary(),
    fun(() -> gleam@http@response:response(wisp:body()))
) -> gleam@http@response:response(wisp:body()).
inject_live_reload(Req, Root, K) ->
    _assert_subject = gleam@regex:from_string(<<".*\\.html$"/utf8>>),
    {ok, Is_interesting} = case _assert_subject of
        {ok, _} -> _assert_subject;
        _assert_fail ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail,
                        module => <<"lustre_dev_tools/server"/utf8>>,
                        function => <<"inject_live_reload"/utf8>>,
                        line => 116})
    end,
    gleam@bool:lazy_guard(
        not gleam@regex:check(Is_interesting, erlang:element(8, Req)),
        K,
        fun() ->
            Path = filepath:join(Root, erlang:element(8, Req)),
            case simplifile_erl:is_file(Path) of
                {ok, false} ->
                    K();

                {error, _} ->
                    K();

                {ok, true} ->
                    _assert_subject@1 = simplifile:read(Path),
                    {ok, Html} = case _assert_subject@1 of
                        {ok, _} -> _assert_subject@1;
                        _assert_fail@1 ->
                            erlang:error(#{gleam_error => let_assert,
                                        message => <<"Assertion pattern match failed"/utf8>>,
                                        value => _assert_fail@1,
                                        module => <<"lustre_dev_tools/server"/utf8>>,
                                        function => <<"inject_live_reload"/utf8>>,
                                        line => 123})
                    end,
                    _pipe = Html,
                    _pipe@1 = lustre_dev_tools@server@live_reload:inject(_pipe),
                    _pipe@2 = gleam@string_builder:from_string(_pipe@1),
                    wisp:html_response(_pipe@2, 200)
            end
        end
    ).

-spec handler(gleam@http@request:request(wisp:connection()), binary()) -> gleam@http@response:response(wisp:body()).
handler(Req, Root) ->
    inject_live_reload(
        Req,
        Root,
        fun() ->
            wisp:serve_static(
                Req,
                <<"/"/utf8>>,
                Root,
                fun() ->
                    handler(
                        erlang:setelement(8, Req, <<"/index.html"/utf8>>),
                        Root
                    )
                end
            )
        end
    ).

-spec start(integer()) -> lustre_dev_tools@cli:cli(nil).
start(Port) ->
    _assert_subject = lustre_dev_tools_ffi:get_cwd(),
    {ok, Cwd} = case _assert_subject of
        {ok, _} -> _assert_subject;
        _assert_fail ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail,
                        module => <<"lustre_dev_tools/server"/utf8>>,
                        function => <<"start"/utf8>>,
                        line => 28})
    end,
    _assert_subject@1 = filepath:expand(
        filepath:join(Cwd, lustre_dev_tools@project:root())
    ),
    {ok, Root} = case _assert_subject@1 of
        {ok, _} -> _assert_subject@1;
        _assert_fail@1 ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail@1,
                        module => <<"lustre_dev_tools/server"/utf8>>,
                        function => <<"start"/utf8>>,
                        line => 29})
    end,
    _assert_subject@2 = filepath:expand(
        filepath:join(Cwd, lustre_dev_tools@project:build_dir(false))
    ),
    {ok, Build_dir} = case _assert_subject@2 of
        {ok, _} -> _assert_subject@2;
        _assert_fail@2 ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail@2,
                        module => <<"lustre_dev_tools/server"/utf8>>,
                        function => <<"start"/utf8>>,
                        line => 30})
    end,
    _assert_subject@3 = filepath:expand(filepath:join(Build_dir, <<".."/utf8>>)),
    {ok, Source_dir} = case _assert_subject@3 of
        {ok, _} -> _assert_subject@3;
        _assert_fail@3 ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail@3,
                        module => <<"lustre_dev_tools/server"/utf8>>,
                        function => <<"start"/utf8>>,
                        line => 32})
    end,
    lustre_dev_tools@cli:do(
        lustre_dev_tools@server@proxy:get(),
        fun(Proxy) ->
            case Proxy of
                {some, _} ->
                    gleam@io:println(
                        <<"
[WARNING] Support for proxying requests to another server is currently still
**experimental**. It's functionality or api may change is breaking ways even
between minor versions. If you run into any problems please open an issue over
at https://github.com/lustre-labs/dev-tools/issues/new
      "/utf8>>
                    );

                none ->
                    nil
            end,
            lustre_dev_tools@cli:do(
                lustre_dev_tools@cli:get_flags(),
                fun(Flags) ->
                    lustre_dev_tools@cli:'try'(
                        lustre_dev_tools@server@live_reload:start(Root, Flags),
                        fun(Make_socket) ->
                            lustre_dev_tools@cli:'try'(
                                begin
                                    _pipe@1 = fun(Req) ->
                                        lustre_dev_tools@server@proxy:middleware(
                                            Req,
                                            Proxy,
                                            fun() ->
                                                case gleam@http@request:path_segments(
                                                    Req
                                                ) of
                                                    [<<"lustre-dev-tools"/utf8>>] ->
                                                        Make_socket(Req);

                                                    [] ->
                                                        _pipe = erlang:setelement(
                                                            8,
                                                            Req,
                                                            <<Build_dir/binary,
                                                                "/index.html"/utf8>>
                                                        ),
                                                        (wisp:mist_handler(
                                                            fun(_capture) ->
                                                                handler(
                                                                    _capture,
                                                                    Build_dir
                                                                )
                                                            end,
                                                            <<""/utf8>>
                                                        ))(_pipe);

                                                    [<<"javascript"/utf8>> | _] ->
                                                        (wisp:mist_handler(
                                                            fun(_capture@1) ->
                                                                src_handler(
                                                                    _capture@1,
                                                                    Source_dir
                                                                )
                                                            end,
                                                            <<""/utf8>>
                                                        ))(Req);

                                                    _ ->
                                                        (wisp:mist_handler(
                                                            fun(_capture@2) ->
                                                                handler(
                                                                    _capture@2,
                                                                    Build_dir
                                                                )
                                                            end,
                                                            <<""/utf8>>
                                                        ))(Req)
                                                end
                                            end
                                        )
                                    end,
                                    _pipe@2 = mist:new(_pipe@1),
                                    _pipe@3 = mist:port(_pipe@2, Port),
                                    _pipe@4 = mist:start_http(_pipe@3),
                                    gleam@result:map_error(
                                        _pipe@4,
                                        fun(Field@0) -> {cannot_start_dev_server, Field@0} end
                                    )
                                end,
                                fun(_) ->
                                    lustre_dev_tools@cli:return(
                                        gleam_erlang_ffi:sleep_forever()
                                    )
                                end
                            )
                        end
                    )
                end
            )
        end
    ).
