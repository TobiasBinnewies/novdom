-module(novdom@hotkey).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([modifier/0, hotkey/0, hotkey_option/0]).

-type modifier() :: shift | alt | short.

-type hotkey() :: {hotkey, binary(), list(modifier())}.

-type hotkey_option() :: {key, hotkey()} | {id, binary()}.


