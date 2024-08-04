-module(lustre_dev_tools@project).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([otp_version/0, build/0, root/0, config/0, build_dir/1, type_to_string/1, replace_node_modules_with_relative_path/1, all_node_modules/0, interface/0, package_json/0, all_node_modules_installed/0]).
-export_type([config/0, interface/0, module_/0, function_/0, package_json/0]).

-type config() :: {config,
        binary(),
        binary(),
        gleam@dict:dict(binary(), tom:toml())}.

-type interface() :: {interface,
        binary(),
        binary(),
        gleam@dict:dict(binary(), module_())}.

-type module_() :: {module,
        gleam@dict:dict(binary(), gleam@package_interface:type()),
        gleam@dict:dict(binary(), function_())}.

-type function_() :: {function,
        list(gleam@package_interface:type()),
        gleam@package_interface:type()}.

-type package_json() :: {package_json,
        gleam@option:option(gleam@dict:dict(binary(), binary())),
        gleam@option:option(gleam@dict:dict(binary(), binary()))}.

-spec otp_version() -> integer().
otp_version() ->
    Version = lustre_dev_tools_ffi:otp_version(),
    case gleam@int:parse(Version) of
        {ok, Version@1} ->
            Version@1;

        {error, _} ->
            erlang:error(#{gleam_error => panic,
                    message => (<<"unexpected version number format: "/utf8,
                        Version/binary>>),
                    module => <<"lustre_dev_tools/project"/utf8>>,
                    function => <<"otp_version"/utf8>>,
                    line => 59})
    end.

-spec build() -> {ok, nil} | {error, lustre_dev_tools@error:error()}.
build() ->
    _pipe = lustre_dev_tools_ffi:exec(
        <<"gleam"/utf8>>,
        [<<"build"/utf8>>, <<"--target"/utf8>>, <<"javascript"/utf8>>],
        <<"."/utf8>>
    ),
    _pipe@1 = gleam@result:map_error(
        _pipe,
        fun(Err) -> {build_error, gleam@pair:second(Err)} end
    ),
    gleam@result:replace(_pipe@1, nil).

-spec check_if_all_dependencies_installed(
    gleam@option:option(gleam@dict:dict(binary(), binary())),
    list(binary())
) -> boolean().
check_if_all_dependencies_installed(Installed, Needed) ->
    case Installed of
        none ->
            false;

        {some, Installed@1} ->
            gleam@list:all(
                Needed,
                fun(Dep) -> gleam@dict:has_key(Installed@1, Dep) end
            )
    end.

-spec find_root(binary()) -> binary().
find_root(Path) ->
    Toml = filepath:join(Path, <<"gleam.toml"/utf8>>),
    case simplifile_erl:is_file(Toml) of
        {ok, false} ->
            find_root(filepath:join(<<".."/utf8>>, Path));

        {error, _} ->
            find_root(filepath:join(<<".."/utf8>>, Path));

        {ok, true} ->
            Path
    end.

-spec root() -> binary().
root() ->
    find_root(<<"."/utf8>>).

-spec config() -> {ok, config()} | {error, lustre_dev_tools@error:error()}.
config() ->
    Configuration_path = filepath:join(root(), <<"gleam.toml"/utf8>>),
    _assert_subject = simplifile:read(Configuration_path),
    {ok, Configuration} = case _assert_subject of
        {ok, _} -> _assert_subject;
        _assert_fail ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail,
                        module => <<"lustre_dev_tools/project"/utf8>>,
                        function => <<"config"/utf8>>,
                        line => 122})
    end,
    _assert_subject@1 = tom:parse(Configuration),
    {ok, Toml} = case _assert_subject@1 of
        {ok, _} -> _assert_subject@1;
        _assert_fail@1 ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail@1,
                        module => <<"lustre_dev_tools/project"/utf8>>,
                        function => <<"config"/utf8>>,
                        line => 123})
    end,
    _assert_subject@2 = tom:get_string(Toml, [<<"name"/utf8>>]),
    {ok, Name} = case _assert_subject@2 of
        {ok, _} -> _assert_subject@2;
        _assert_fail@2 ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail@2,
                        module => <<"lustre_dev_tools/project"/utf8>>,
                        function => <<"config"/utf8>>,
                        line => 124})
    end,
    _assert_subject@3 = tom:get_string(Toml, [<<"version"/utf8>>]),
    {ok, Version} = case _assert_subject@3 of
        {ok, _} -> _assert_subject@3;
        _assert_fail@3 ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail@3,
                        module => <<"lustre_dev_tools/project"/utf8>>,
                        function => <<"config"/utf8>>,
                        line => 125})
    end,
    {ok, {config, Name, Version, Toml}}.

-spec build_dir(boolean()) -> binary().
build_dir(Is_prod) ->
    case Is_prod of
        true ->
            filepath:join(root(), <<"dist"/utf8>>);

        false ->
            filepath:join(root(), <<"build/dev/static"/utf8>>)
    end.

-spec type_to_string(gleam@package_interface:type()) -> binary().
type_to_string(Type_) ->
    case Type_ of
        {tuple, Elements} ->
            Elements@1 = gleam@list:map(Elements, fun type_to_string/1),
            <<<<"#("/utf8,
                    (gleam@string:join(Elements@1, <<", "/utf8>>))/binary>>/binary,
                ")"/utf8>>;

        {fn, Params, Return} ->
            Params@1 = gleam@list:map(Params, fun type_to_string/1),
            Return@1 = type_to_string(Return),
            <<<<<<"fn("/utf8,
                        (gleam@string:join(Params@1, <<", "/utf8>>))/binary>>/binary,
                    ") -> "/utf8>>/binary,
                Return@1/binary>>;

        {named, Name, _, _, []} ->
            Name;

        {named, Name@1, _, _, Params@2} ->
            Params@3 = gleam@list:map(Params@2, fun type_to_string/1),
            <<<<<<Name@1/binary, "("/utf8>>/binary,
                    (gleam@string:join(Params@3, <<", "/utf8>>))/binary>>/binary,
                ")"/utf8>>;

        {variable, Id} ->
            <<"a_"/utf8, (gleam@int:to_string(Id))/binary>>
    end.

-spec is_js(binary()) -> boolean().
is_js(File) ->
    case begin
        _pipe = File,
        _pipe@1 = filepath:extension(_pipe),
        gleam@result:unwrap(_pipe@1, <<""/utf8>>)
    end of
        <<"js"/utf8>> ->
            not begin
                _pipe@2 = File,
                _pipe@3 = filepath:base_name(_pipe@2),
                gleam_stdlib:contains_string(_pipe@3, <<"test"/utf8>>)
            end;

        <<"mjs"/utf8>> ->
            not begin
                _pipe@2 = File,
                _pipe@3 = filepath:base_name(_pipe@2),
                gleam_stdlib:contains_string(_pipe@3, <<"test"/utf8>>)
            end;

        <<"ts"/utf8>> ->
            not begin
                _pipe@2 = File,
                _pipe@3 = filepath:base_name(_pipe@2),
                gleam_stdlib:contains_string(_pipe@3, <<"test"/utf8>>)
            end;

        _ ->
            false
    end.

-spec node_modules_matches(binary()) -> list(gleam@regex:match()).
node_modules_matches(Src) ->
    _assert_subject = gleam@regex:from_string(
        <<"(?:from|import) (?:\"|')([\\w|-]*)(?:\"|')"/utf8>>
    ),
    {ok, Modules} = case _assert_subject of
        {ok, _} -> _assert_subject;
        _assert_fail ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail,
                        module => <<"lustre_dev_tools/project"/utf8>>,
                        function => <<"node_modules_matches"/utf8>>,
                        line => 271})
    end,
    gleam@regex:scan(Modules, Src).

-spec replace_node_modules_with_relative_path(binary()) -> binary().
replace_node_modules_with_relative_path(Src) ->
    Modules = node_modules_matches(Src),
    Replacements = (gleam@list:map(
        Modules,
        fun(Module) ->
            {match, Full, [{some, Name}]} = case Module of
                {match, _, [{some, _}]} -> Module;
                _assert_fail ->
                    erlang:error(#{gleam_error => let_assert,
                                message => <<"Assertion pattern match failed"/utf8>>,
                                value => _assert_fail,
                                module => <<"lustre_dev_tools/project"/utf8>>,
                                function => <<"replace_node_modules_with_relative_path"/utf8>>,
                                line => 247})
            end,
            Replacement = gleam@string:replace(
                Full,
                Name,
                <<<<"/modules/"/utf8, Name/binary>>/binary, ".mjs"/utf8>>
            ),
            {Name, Replacement}
        end
    )),
    gleam@list:fold(
        Replacements,
        Src,
        fun(Src@1, Replacement@1) ->
            _assert_subject = gleam@regex:from_string(
                <<<<"(?:from|import) (?:\"|')("/utf8,
                        (erlang:element(1, Replacement@1))/binary>>/binary,
                    ")(?:\"|')"/utf8>>
            ),
            {ok, To_replace} = case _assert_subject of
                {ok, _} -> _assert_subject;
                _assert_fail@1 ->
                    erlang:error(#{gleam_error => let_assert,
                                message => <<"Assertion pattern match failed"/utf8>>,
                                value => _assert_fail@1,
                                module => <<"lustre_dev_tools/project"/utf8>>,
                                function => <<"replace_node_modules_with_relative_path"/utf8>>,
                                line => 254})
            end,
            gleam_stdlib:regex_replace(
                To_replace,
                Src@1,
                erlang:element(2, Replacement@1)
            )
        end
    ).

-spec used_node_modules(binary()) -> list(binary()).
used_node_modules(Src) ->
    Modules = node_modules_matches(Src),
    gleam@list:map(
        Modules,
        fun(Module) ->
            {match, _, [{some, Name}]} = case Module of
                {match, _, [{some, _}]} -> Module;
                _assert_fail ->
                    erlang:error(#{gleam_error => let_assert,
                                message => <<"Assertion pattern match failed"/utf8>>,
                                value => _assert_fail,
                                module => <<"lustre_dev_tools/project"/utf8>>,
                                function => <<"used_node_modules"/utf8>>,
                                line => 266})
            end,
            Name
        end
    ).

-spec all_node_modules() -> list(binary()).
all_node_modules() ->
    Src_dir = filepath:join(root(), <<"build/dev/javascript"/utf8>>),
    _assert_subject = simplifile:get_files(Src_dir),
    {ok, Files} = case _assert_subject of
        {ok, _} -> _assert_subject;
        _assert_fail ->
            erlang:error(#{gleam_error => let_assert,
                        message => <<"Assertion pattern match failed"/utf8>>,
                        value => _assert_fail,
                        module => <<"lustre_dev_tools/project"/utf8>>,
                        function => <<"all_node_modules"/utf8>>,
                        line => 221})
    end,
    _pipe@2 = (gleam@list:fold(
        Files,
        gleam@set:new(),
        fun(Modules, File) ->
            gleam@bool:guard(
                not is_js(File),
                Modules,
                fun() ->
                    _assert_subject@1 = simplifile:read(File),
                    {ok, Src} = case _assert_subject@1 of
                        {ok, _} -> _assert_subject@1;
                        _assert_fail@1 ->
                            erlang:error(#{gleam_error => let_assert,
                                        message => <<"Assertion pattern match failed"/utf8>>,
                                        value => _assert_fail@1,
                                        module => <<"lustre_dev_tools/project"/utf8>>,
                                        function => <<"all_node_modules"/utf8>>,
                                        line => 225})
                    end,
                    _pipe = used_node_modules(Src),
                    _pipe@1 = gleam@set:from_list(_pipe),
                    gleam@set:union(_pipe@1, Modules)
                end
            )
        end
    )),
    gleam@set:to_list(_pipe@2).

-spec labelled_argument_decoder(gleam@dynamic:dynamic_()) -> {ok,
        gleam@package_interface:type()} |
    {error, list(gleam@dynamic:decode_error())}.
labelled_argument_decoder(Dyn) ->
    (gleam@dynamic:field(
        <<"type"/utf8>>,
        fun gleam@package_interface:type_decoder/1
    ))(Dyn).

-spec function_decoder(gleam@dynamic:dynamic_()) -> {ok, function_()} |
    {error, list(gleam@dynamic:decode_error())}.
function_decoder(Dyn) ->
    (gleam@dynamic:decode2(
        fun(Field@0, Field@1) -> {function, Field@0, Field@1} end,
        gleam@dynamic:field(
            <<"parameters"/utf8>>,
            gleam@dynamic:list(fun labelled_argument_decoder/1)
        ),
        gleam@dynamic:field(
            <<"return"/utf8>>,
            fun gleam@package_interface:type_decoder/1
        )
    ))(Dyn).

-spec string_dict(
    fun((gleam@dynamic:dynamic_()) -> {ok, XDP} |
        {error, list(gleam@dynamic:decode_error())})
) -> fun((gleam@dynamic:dynamic_()) -> {ok, gleam@dict:dict(binary(), XDP)} |
    {error, list(gleam@dynamic:decode_error())}).
string_dict(Values) ->
    gleam@dynamic:dict(fun gleam@dynamic:string/1, Values).

-spec module_decoder(gleam@dynamic:dynamic_()) -> {ok, module_()} |
    {error, list(gleam@dynamic:decode_error())}.
module_decoder(Dyn) ->
    (gleam@dynamic:decode2(
        fun(Field@0, Field@1) -> {module, Field@0, Field@1} end,
        gleam@dynamic:field(
            <<"constants"/utf8>>,
            string_dict(
                gleam@dynamic:field(
                    <<"type"/utf8>>,
                    fun gleam@package_interface:type_decoder/1
                )
            )
        ),
        gleam@dynamic:field(
            <<"functions"/utf8>>,
            string_dict(fun function_decoder/1)
        )
    ))(Dyn).

-spec interface_decoder(gleam@dynamic:dynamic_()) -> {ok, interface()} |
    {error, list(gleam@dynamic:decode_error())}.
interface_decoder(Dyn) ->
    (gleam@dynamic:decode3(
        fun(Field@0, Field@1, Field@2) -> {interface, Field@0, Field@1, Field@2} end,
        gleam@dynamic:field(<<"name"/utf8>>, fun gleam@dynamic:string/1),
        gleam@dynamic:field(<<"version"/utf8>>, fun gleam@dynamic:string/1),
        gleam@dynamic:field(
            <<"modules"/utf8>>,
            string_dict(fun module_decoder/1)
        )
    ))(Dyn).

-spec interface() -> {ok, interface()} | {error, lustre_dev_tools@error:error()}.
interface() ->
    gleam@result:'try'(
        config(),
        fun(_use0) ->
            {config, Name, _, _} = _use0,
            Caches = [<<"build/prod/javascript"/utf8>>,
                <<"build/prod/erlang"/utf8>>,
                <<"build/dev/javascript"/utf8>>,
                <<"build/dev/erlang"/utf8>>],
            gleam@list:each(
                Caches,
                fun(Cache) -> _pipe = filepath:join(root(), Cache),
                    _pipe@1 = filepath:join(_pipe, Name),
                    simplifile_erl:delete(_pipe@1) end
            ),
            Dir = filepath:join(root(), <<"build/.lustre"/utf8>>),
            Out = filepath:join(Dir, <<"package-interface.json"/utf8>>),
            Args = [<<"export"/utf8>>,
                <<"package-interface"/utf8>>,
                <<"--out"/utf8>>,
                Out],
            _pipe@2 = lustre_dev_tools_ffi:exec(
                <<"gleam"/utf8>>,
                Args,
                <<"."/utf8>>
            ),
            _pipe@3 = gleam@result:map_error(
                _pipe@2,
                fun(Err) -> {build_error, gleam@pair:second(Err)} end
            ),
            gleam@result:then(
                _pipe@3,
                fun(_) ->
                    _assert_subject = simplifile:read(Out),
                    {ok, Json} = case _assert_subject of
                        {ok, _} -> _assert_subject;
                        _assert_fail ->
                            erlang:error(#{gleam_error => let_assert,
                                        message => <<"Assertion pattern match failed"/utf8>>,
                                        value => _assert_fail,
                                        module => <<"lustre_dev_tools/project"/utf8>>,
                                        function => <<"interface"/utf8>>,
                                        line => 104})
                    end,
                    _assert_subject@1 = gleam@json:decode(
                        Json,
                        fun interface_decoder/1
                    ),
                    {ok, Interface} = case _assert_subject@1 of
                        {ok, _} -> _assert_subject@1;
                        _assert_fail@1 ->
                            erlang:error(#{gleam_error => let_assert,
                                        message => <<"Assertion pattern match failed"/utf8>>,
                                        value => _assert_fail@1,
                                        module => <<"lustre_dev_tools/project"/utf8>>,
                                        function => <<"interface"/utf8>>,
                                        line => 105})
                    end,
                    {ok, Interface}
                end
            )
        end
    ).

-spec package_json_decoder(gleam@dynamic:dynamic_()) -> {ok, package_json()} |
    {error, list(gleam@dynamic:decode_error())}.
package_json_decoder(Dyn) ->
    (gleam@dynamic:decode2(
        fun(Field@0, Field@1) -> {package_json, Field@0, Field@1} end,
        gleam@dynamic:optional_field(
            <<"dependencies"/utf8>>,
            string_dict(fun gleam@dynamic:string/1)
        ),
        gleam@dynamic:optional_field(
            <<"devDependencies"/utf8>>,
            string_dict(fun gleam@dynamic:string/1)
        )
    ))(Dyn).

-spec package_json() -> {ok, package_json()} | {error, simplifile:file_error()}.
package_json() ->
    gleam@result:'try'(
        simplifile:read(<<"package.json"/utf8>>),
        fun(Json) ->
            _assert_subject = gleam@json:decode(
                Json,
                fun package_json_decoder/1
            ),
            {ok, Package_json} = case _assert_subject of
                {ok, _} -> _assert_subject;
                _assert_fail ->
                    erlang:error(#{gleam_error => let_assert,
                                message => <<"Assertion pattern match failed"/utf8>>,
                                value => _assert_fail,
                                module => <<"lustre_dev_tools/project"/utf8>>,
                                function => <<"package_json"/utf8>>,
                                line => 166})
            end,
            {ok, Package_json}
        end
    ).

-spec all_node_modules_installed() -> boolean().
all_node_modules_installed() ->
    case package_json() of
        {error, _} ->
            false;

        {ok, Package_json} ->
            Dependencies = erlang:element(2, Package_json),
            Dev_dependencies = erlang:element(3, Package_json),
            Has_dependencies = check_if_all_dependencies_installed(
                Dependencies,
                [<<"quill"/utf8>>, <<"tailwind-merge"/utf8>>]
            ),
            Has_dev_dependencies = check_if_all_dependencies_installed(
                Dev_dependencies,
                [<<"jsdom"/utf8>>]
            ),
            Has_dependencies andalso Has_dev_dependencies
    end.
