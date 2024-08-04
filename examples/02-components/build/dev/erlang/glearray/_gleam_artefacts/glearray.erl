-module(glearray).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([new/0, from_list/1, to_list/1, length/1, get/2, copy_set/3, copy_push/2, copy_insert/3, iterate/1]).
-export_type([array/1]).

-type array(LKO) :: any() | {gleam_phantom, LKO}.

-spec new() -> array(any()).
new() ->
    glearray_ffi:new().

-spec from_list(list(LKR)) -> array(LKR).
from_list(List) ->
    erlang:list_to_tuple(List).

-spec to_list(array(LKU)) -> list(LKU).
to_list(Array) ->
    erlang:tuple_to_list(Array).

-spec length(array(any())) -> integer().
length(Array) ->
    erlang:tuple_size(Array).

-spec is_valid_index(array(any()), integer()) -> boolean().
is_valid_index(Array, Index) ->
    (Index >= 0) andalso (Index < erlang:tuple_size(Array)).

-spec get(array(LKZ), integer()) -> {ok, LKZ} | {error, nil}.
get(Array, Index) ->
    case is_valid_index(Array, Index) of
        true ->
            {ok, glearray_ffi:get(Array, Index)};

        false ->
            {error, nil}
    end.

-spec copy_set(array(LLF), integer(), LLF) -> {ok, array(LLF)} | {error, nil}.
copy_set(Array, Index, Value) ->
    case is_valid_index(Array, Index) of
        true ->
            {ok, glearray_ffi:set(Array, Index, Value)};

        false ->
            {error, nil}
    end.

-spec copy_push(array(LLP), LLP) -> array(LLP).
copy_push(Array, Value) ->
    erlang:append_element(Array, Value).

-spec copy_insert(array(LLS), integer(), LLS) -> {ok, array(LLS)} | {error, nil}.
copy_insert(Array, Index, Value) ->
    case (Index >= 0) andalso (Index =< erlang:tuple_size(Array)) of
        true ->
            {ok, glearray_ffi:insert(Array, Index, Value)};

        false ->
            {error, nil}
    end.

-spec iterate(array(LMA)) -> gleam@iterator:iterator(LMA).
iterate(Array) ->
    gleam@iterator:unfold(0, fun(Index) -> case get(Array, Index) of
                {ok, Element} ->
                    {next, Element, Index + 1};

                {error, _} ->
                    done
            end end).
