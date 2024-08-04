-module(novdom@internals@parameter).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([event/0, trigger_option/0, modifier_store/0, parameter/0]).

-type event() :: any().

-type trigger_option() :: start | 'end'.

-type modifier_store() :: {render, fun(() -> nil)} |
    {unrender, fun(() -> nil), trigger_option()}.

-type parameter() :: {attribute, binary(), binary()} |
    {listener, binary(), fun((event()) -> nil)} |
    {modifier, fun((novdom@component:component()) -> modifier_store())} |
    {parameter_list, list(parameter())} |
    {component_parameter_list,
        fun((novdom@component:component()) -> list(parameter()))}.


