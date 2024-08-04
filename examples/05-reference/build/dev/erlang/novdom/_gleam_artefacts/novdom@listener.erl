-module(novdom@listener).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([onclick/1, onmousemove/1, onemouseover/1, onmouseout/1, onmousedown/1, onmouseup/1, onkeydown/1, ontransitionend/1, ontransitionstart/1]).

-spec onclick(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onclick(Callback) ->
    {listener, <<"click"/utf8>>, Callback}.

-spec onmousemove(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onmousemove(Callback) ->
    {listener, <<"mousemove"/utf8>>, Callback}.

-spec onemouseover(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onemouseover(Callback) ->
    {listener, <<"mouseover"/utf8>>, Callback}.

-spec onmouseout(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onmouseout(Callback) ->
    {listener, <<"mouseout"/utf8>>, Callback}.

-spec onmousedown(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onmousedown(Callback) ->
    {listener, <<"mousedown"/utf8>>, Callback}.

-spec onmouseup(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onmouseup(Callback) ->
    {listener, <<"mouseup"/utf8>>, Callback}.

-spec onkeydown(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
onkeydown(Callback) ->
    {listener, <<"keydown"/utf8>>, Callback}.

-spec ontransitionend(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
ontransitionend(Callback) ->
    {listener, <<"transitionend"/utf8>>, Callback}.

-spec ontransitionstart(fun((novdom@internals@parameter:event()) -> nil)) -> novdom@internals@parameter:parameter().
ontransitionstart(Callback) ->
    {listener, <<"transitionstart"/utf8>>, Callback}.
