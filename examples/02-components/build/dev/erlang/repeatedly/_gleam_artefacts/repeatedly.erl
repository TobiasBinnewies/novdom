-module(repeatedly).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([call/3, stop/1, set_function/2, update_state/2, set_state/2]).
-export_type([repeater/1]).

-type repeater(UHH) :: any() | {gleam_phantom, UHH}.

-spec call(integer(), UHI, fun((UHI, integer()) -> any())) -> repeater(UHI).
call(Delay_ms, State, Function) ->
    repeatedly_ffi:call(Delay_ms, State, Function).

-spec stop(repeater(any())) -> nil.
stop(Repeater) ->
    repeatedly_ffi:stop(Repeater).

-spec set_function(repeater(UHN), fun((UHN, integer()) -> any())) -> nil.
set_function(Repeater, Function) ->
    repeatedly_ffi:replace(Repeater, Function).

-spec update_state(repeater(UHS), fun((UHS) -> UHS)) -> nil.
update_state(Repeater, Function) ->
    repeatedly_ffi:update_state(Repeater, Function).

-spec set_state(repeater(UHQ), UHQ) -> nil.
set_state(Repeater, State) ->
    repeatedly_ffi:update_state(Repeater, fun(_) -> State end).