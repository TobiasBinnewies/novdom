
export function get_mouse_pos(mouseevent) {
    return {
        x: mouseevent.clientX,
        y: mouseevent.clientY,
        offset_x: mouseevent.offsetX,
        offset_y: mouseevent.offsetY,
        target: mouseevent.relatedTarget,
        screen_x: mouseevent.screenX,
        screen_y: mouseevent.screenY,
    }
}