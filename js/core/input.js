/**
 * Input manager
 * @author Jani Nykänen
 */

// Constants
const KEY_BUFFER_SIZE = 256;
const MOUSE_BUFFER_SIZE = 16;

// Input object
input = {};

// States
state = {
    UP: 0,
    DOWN: 1,
    PRESSED: 2,
    RELEASED: 3
}
// Key states
input.keyStates = new Array(KEY_BUFFER_SIZE);
// Mouse button states
input.mouseStates = new Array(MOUSE_BUFFER_SIZE);
// Cursor position
input.cursorPos = {x: 0, y: 0};


/**
 * Update a state array
 * @param {*} arr State array
 */
input.update_state_array = function(arr) {

    for(var i = 0; i < arr.length; ++ i) {

        if(arr[i] == state.PRESSED)
            arr[i] = state.DOWN;

        else if(arr[i] == state.RELEASED)
            arr[i] = state.UP;
    }
}


/**
 * Down state event
 * @param arr Array
 * @param id Event object id
 */
input.down_state_event = function(arr, id) {

    if(id < 0 || id >= arr.length || arr[id] == state.DOWN)
        return;

    arr[id] = state.PRESSED;
}


/**
 * Up state event
 * @param arr Array
 * @param id Event object id
 */
input.up_state_event = function(arr, id) {

    if(id < 0 || id >= arr.length || arr[id] == state.UP)
        return;

    arr[id] = state.RELEASED;
}


/**
 * Initialize input
 */
input.init = function() {

    // Set default states
    for(var i = 0;  i < input.keyStates.length; ++ i) {

        input.keyStates[i] = state.UP;
        if(i < input.mouseStates.length)
            input.mouseStates[i] = state.UP;
    }
}


/**
 * Key down event
 * @param key Key code
 */
input.key_down = function(key) {

    input.down_state_event(input.keyStates, key);
}


/**
 * Key up event
 * @param key Key code
 */
input.key_up = function(key) {

    input.up_state_event(input.keyStates, key);
}


/**
 * Mouse button down event
 * @param b Button index
 */
input.mouse_down = function(b) {

    input.down_state_event(input.mouseStates, b);
}


/**
 * Mouse button up event
 * @param b Button index
 */
input.mouse_up = function(b) {

    input.up_state_event(input.mouseStates, b);
}


/**
 * Cursor move event
 */
input.mouse_move = function(x, y) {

    input.cursorPos.x = x;
    input.cursorPos.y = y;
}


/**
 * Update input
 */
input.update = function() {

    // Update state arrays
    input.update_state_array(input.keyStates);
    input.update_state_array(input.mouseStates);
}


/**
 * Return the cursor position in current viewport
 * @return Cursor position
 */
input.cursor_pos = function() {

    var w = tr.viewport.w;
    var h = tr.viewport.h;
    var cw = graph.canvas.width;
    var ch = graph.canvas.height;

    var x = w/cw * this.cursorPos.x;
    var y = h/ch * this.cursorPos.y;

    return {x: x, y: y};
}
