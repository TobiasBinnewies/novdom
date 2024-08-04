-module(novdom@attribute).
-compile([no_auto_import, nowarn_unused_vars, nowarn_unused_function, nowarn_nomatch]).

-export([class/1, tailwind/1, style/1, hidden/0, editable/0]).

-spec class(binary()) -> novdom@internals@parameter:parameter().
class(Value) ->
    {attribute, <<"class"/utf8>>, Value}.

-spec tailwind(binary()) -> novdom@internals@parameter:parameter().
tailwind(Value) ->
    {attribute, <<"tailwind"/utf8>>, Value}.

-spec style(list({binary(), binary()})) -> novdom@internals@parameter:parameter().
style(Values) ->
    Res@1 = (gleam@list:fold(
        Values,
        <<""/utf8>>,
        fun(Res, _use1) ->
            {Key, Value} = _use1,
            case Value of
                <<""/utf8>> ->
                    <<<<Res/binary, Key/binary>>/binary, ";"/utf8>>;

                _ ->
                    <<<<<<<<Res/binary, Key/binary>>/binary, ":"/utf8>>/binary,
                            Value/binary>>/binary,
                        ";"/utf8>>
            end
        end
    )),
    {attribute, <<"style"/utf8>>, Res@1}.

-spec hidden() -> novdom@internals@parameter:parameter().
hidden() ->
    {attribute, <<"hidden"/utf8>>, <<"hidden"/utf8>>}.

-spec editable() -> novdom@internals@parameter:parameter().
editable() ->
    {attribute, <<"contenteditable"/utf8>>, <<"true"/utf8>>}.
