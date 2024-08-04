-record(listener, {
    name :: binary(),
    callback :: fun((novdom@internals@parameter:event()) -> nil)
}).
