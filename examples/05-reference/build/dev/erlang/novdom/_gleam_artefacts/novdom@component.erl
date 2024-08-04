-module(novdom@component).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([html_element/0, component/0]).

-type html_element() :: html_element.

-type component() :: {component, binary(), html_element()}.


