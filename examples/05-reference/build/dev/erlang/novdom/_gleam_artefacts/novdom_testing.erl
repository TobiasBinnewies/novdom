-module(novdom_testing).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([callee/0]).

-opaque callee() :: {callee, binary()}.


