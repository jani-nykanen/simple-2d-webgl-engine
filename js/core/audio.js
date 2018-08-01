/**
 * Audio systems
 * @author Jani Nykänen
 */


// Audio object
audio = {};

// Is enabled
audio.enabled = true;


/**
 * Toggle audio
 * @param state State
 */
audio.toggle = function(state) {

    audio.enabled = state;
}
