-module(novdom@container).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export_type([alignment/0, spacing/0, direction/0, scroll/0]).

-type alignment() :: top |
    bottom |
    left |
    right |
    center |
    top_left |
    top_right |
    bottom_left |
    bottom_right.

-type spacing() :: {gap, binary()} |
    no_spacing |
    even_spacing |
    between_spacing |
    around_spacing.

-type direction() :: vertical_direction | horizontal_direction.

-type scroll() :: vertical_scroll | horizontal_scroll | scroll | no_scroll.


