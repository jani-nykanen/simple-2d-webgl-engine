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
// Music base volume
audio.musicBaseVol = 0.0;
// Reduce music colume
audio.reducedVol = 0.0;


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

    audio.musicBaseVol= vol;
    sound.volume(vol, sound);
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


/**
 * Reduce music volume to certain percentage
 * @param p Percentage
 * @param time Time
 */
audio.reduce_music = function(p, time) {

    if(!audio.enabled || audio.musicID == null) return;

    audio.reducedVol = audio.musicBaseVol * p;
    audio.musicSound.fade(audio.musicBaseVol, audio.reducedVol , time, audio.musicID);
}


/**
 * Reset music volume
 * @param time Timue
 */
audio.reset_music_volume = function(time) {

    if(!audio.enabled || audio.musicID == null) return;

    audio.musicSound.fade(audio.reducedVol, audio.musicBaseVol , time, audio.musicID);
}


/**
 * Play a smaple
 * @param sound Sound (read: sample)
 * @param vol Voulme
 */
audio.play_sample = function(sound, vol) {

    if(!sound.playID) {

        sound.playID = sound.play();

        sound.volume(vol, sound.playID );
        sound.loop(false, sound.playID );
    }
    else {

        sound.stop(sound.playID);
        sound.volume(vol, sound.playID );
        sound.loop(false, sound.playID );
        sound.play(sound.playID);
    }
}
