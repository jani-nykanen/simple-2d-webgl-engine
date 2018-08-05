/**
 * Global scene
 * @author Jani Nykänen
 */

// Constants
const FADE_IN = 0;
const FADE_OUT = 1;
const FADE_MAX = 60.0;

const SPC_TEXT = "Protect your heart!";

const MUSIC_VOLUME = 0.75;
const SAMPLE_VOLUME = 1.0;

// Global object
global = {};

// TODO: fade.js
// Fade timer
global.fadeTimer = FADE_MAX;
// Fade mode
global.fadeMode = FADE_OUT;
// Fade speed
global.fadeSpeed = 1.0;
// Fade color
global.fadeColor = {r: 0, g: 0, b: 0};
// Fade callback
global.fadeCb = null;
// Is fading
global.fading = false;
// Draw special text
global.drawSpcText = false;
// Special text shown
global.spcTextShown = false;

// On load triggered
global.onLoadTriggered = false;


// Initialize
global.init = function() {
    
    // Load assets
    assets.load({
        font: "font.png",
        player: "player.png",
        animal: "animal.png",
        monster: "monster.png",
        missile: "missile.png",
        gas: "gas.png",
        bg: "background.jpg",
        bgElements: "bg_elements.png",
        heart: "heart.png",
        fetus: "fetus.png",
        explosion: "explosion.png",
        pow: "pow.png",
        arrow: "arrow.png",
        healthBar: "healthbar.png",
        mapIcons: "map_icons.png",
        duck: "duck.png",
        pause: "pause.png",
        guide: "guide.png",
        logo: "logo.png",
        figures: "figures.png",
        intro: "intro.png",
    }, "assets/bitmaps",

    {
        theme: "theme.ogg",
        magnet: "magnet.wav",
        explosion: "explosion.wav",
        hit: "hit.wav",
        hurt: "hurt.wav",
        select: "select.wav",
        pause: "pause.wav",
        choose: "choose.wav",
        gas: "gas.wav",
    }, "assets/audio");

    // Fade!
    global.fade(FADE_OUT, 1.0, {r:1,g:1,b:1}, null);

    // Set sample volume
    audio.set_sample_volume(SAMPLE_VOLUME);
}


// Data loaded
global.on_load = function() {

    const BUTTON_VOL = 0.75;
    const BUTTON_OVERLAY_VOL = 0.80;

    set_global_button_audio(assets.audio.select, BUTTON_VOL, 
        assets.audio.choose, BUTTON_OVERLAY_VOL);
}


// Update fading
global.update_fading = function(tm) {

    if(global.fading) {

        global.fadeTimer -= global.fadeSpeed * tm;
        if(global.fadeTimer <= 0.0) {

            if(global.fadeMode == FADE_IN) {
                global.fadeTimer = FADE_MAX;
                global.fadeMode = global

                if(global.fadeCb != null) {

                    global.fadeCb();
                }
            }
            else {

                global.fading = false;
                if(global.spcTextShown)
                    global.drawSpcText = false;
                
            }
        }
    }
}


// Draw fading
global.draw_fading = function() {

    if(!global.fading) return;

    let t = global.fadeTimer / FADE_MAX;

    if(global.fadeMode == FADE_IN) {

        t = 1.0 - t;
    }
    
    tr.set_view(1, 1);
    tr.identity();
    tr.use_transform();
    
    graph.set_color(global.fadeColor.r, global.fadeColor.g, global.fadeColor.b, t);
    graph.fill_rectangle(0,0,1,1);
    graph.set_color(1, 1, 1, 1);
}


// Update
global.update = function(tm) {

    // Called when everything is loaded
    if(!global.onLoadTriggered ) {

        global.on_load();
        global.onLoadTriggered = true;
    }

    // Update key config
    kconf.update();

    // Update fading
    global.update_fading(tm);
}


// Draw
global.draw = function() {

    // Draw fading
    global.draw_fading();

    // Draw special text
    if(global.drawSpcText) {

        tr.fit_view_height(CAMERA_HEIGHT);
        tr.identity();
        tr.use_transform();

        let alpha = global.fadeTimer / FADE_MAX;
        graph.set_color(1,1,1, alpha);

        graph.draw_text(assets.bitmaps.font, SPC_TEXT,
            tr.viewport.w/2,tr.viewport.h/2-32,-24,0, true, 2.0-alpha);

        graph.set_color(1,1,1, 1);
    }
}


// Change
global.on_change = function() {

}


// Fade
global.fade = function(mode, speed, color, cb) {

    global.fadeMode = mode;
    global.fadeSpeed = speed;
    if(color != null) {
        global.fadeColor.r = color.r;
        global.fadeColor.b = color.b;
        global.fadeColor.g = color.g;
    }
    global.fadeCb = cb;
    global.fading = true;
    global.fadeTimer = FADE_MAX;
}


// Add scene
core.add_scene(new Scene(global.init, global.update, global.draw, global.on_change ), "global");
