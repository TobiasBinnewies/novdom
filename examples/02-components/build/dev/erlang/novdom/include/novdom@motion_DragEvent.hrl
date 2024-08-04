-record(drag_event, {
    value :: any(),
    preview :: novdom@component:component(),
    drop :: fun((novdom@motion:drag_event(any())) -> nil),
    cancel :: fun((novdom@motion:drag_event(any()), fun(() -> nil)) -> nil),
    droppable :: boolean()
}).
