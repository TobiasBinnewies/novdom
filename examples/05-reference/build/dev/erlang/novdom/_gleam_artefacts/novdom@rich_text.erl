-module(novdom@rich_text).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([editor/1]).
-export_type([quill/0, delta/0, rich_text_store/0, format/0]).

-type quill() :: any().

-type delta() :: any().

-opaque rich_text_store() :: {rich_text_store,
        quill(),
        novdom@component:component()}.

-type format() :: bold | italic | underline.

-spec editor(rich_text_store()) -> novdom@component:component().
editor(Store) ->
    erlang:element(3, Store).
