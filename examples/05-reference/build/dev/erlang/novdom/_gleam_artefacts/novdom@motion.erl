-module(novdom@motion).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([drag_event/1, preview_type/0]).

-type drag_event(TPH) :: {drag_event,
        TPH,
        novdom@component:component(),
        fun((drag_event(TPH)) -> nil),
        fun((drag_event(TPH), fun(() -> nil)) -> nil),
        boolean()}.

-type preview_type() :: {preview, novdom@component:component()} | self.


