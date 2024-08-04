-module(novdom@reference).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([from_id/1]).
-export_type([reference_type/0, reference_/0]).

-type reference_type() :: value | inner_html.

-type reference_() :: {reference, binary()}.

-spec from_id(binary()) -> reference_().
from_id(Id) ->
    {reference, Id}.
