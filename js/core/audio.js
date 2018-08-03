/**
 * Audio systems
 * @author Jani Nykänen
 */


// Audio object
audio = {};

// Is enabled
audio.enabled = true;

// Music id
audio.musicID = null;
// Music sound
audio.musicSound = null;


/**
 * Toggle audio
 * @param state State
 */
audio.toggle = function(state) {

    audio.enabled = state;
    if(state) {

        audio.resume_music();
    }
    else {

        audio.stop_music();
    }
}


/**
 * Fade in music
 * @param sound Sample
 * @param vol Volume
 * @param time Fade time
 */
audio.fade_in_music = function(sound, vol, time) {

    if(audio.musicID == null) {

        audio.musicID = sound.play();
        audio.musicSound = sound;
    }

    sound.volume(sound);
    sound.loop(true, audio.musicID);
    sound.fade(0.0, vol, time, audio.musicID);
}


/**
 * Stop music
 */
audio.stop_music = function() {

    audio.musicSound.pause(audio.musicID);
}


/**
 * Resume music
 */
audio.resume_music = function() {

    audio.musicSound.play(audio.musicID);
}
