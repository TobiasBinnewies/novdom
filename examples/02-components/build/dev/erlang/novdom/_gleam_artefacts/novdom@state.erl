-module(novdom@state).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([from_id/1]).
-export_type([state/1]).

-type state(TOI) :: {state, binary()} |
    {state_item, binary(), binary()} |
    {gleam_phantom, TOI}.

-spec from_id(binary()) -> state(any()).
from_id(Id) ->
    {state, Id}.
