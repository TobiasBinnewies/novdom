-module(novdom@component).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([document/0, get_component/1, html/1]).
-export_type([component/0]).

-opaque component() :: {component, binary(), binary()}.

-spec document() -> component().
document() ->
    {component, <<"document"/utf8>>, <<""/utf8>>}.

-spec get_component(binary()) -> component().
get_component(Id) ->
    {component, Id, <<""/utf8>>}.

-spec html(binary()) -> component().
html(Value) ->
    {component, <<"_HTML_"/utf8>>, Value}.
