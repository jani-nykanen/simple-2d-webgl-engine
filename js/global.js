/**
 * Global scene
 * @author Jani Nykänen
 */

// Constants
const FADE_IN = 0;
const FADE_OUT = 1;
const FADE_MAX = 60.0;

// Global object
global = {};

// TODO: fade.js
// Fade timer
global.fadeTimer = 60.0;
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


// Initialize
global.init = function() {
    
    // Load assets
    assets.load({
        font: "font.png",
        player: "player.png",
        animal: "animal.png",
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
    }, "assets/bitmaps");

    // Fade!
    global.fade(FADE_OUT, 1.0, {r:1,g:1,b:1}, null);
}


// Update fading
global.update_fading = function(tm) {

    if(this.fading) {

        this.fadeTimer -= 1.0 * tm;
        if(this.fadeTimer <= 0.0) {

            if(this.fadeMode == FADE_IN) {
                this.fadeTimer = FADE_MAX;
                this.fadeMode = this

                if(this.fadeCb != null) {

                    this.fadeCb();
                }
            }
            else {

                this.fading = false;
            }
        }
    }
}


// Draw fading
global.draw_fading = function() {

    if(!this.fading) return;

    let t = this.fadeTimer / FADE_MAX;

    if(this.fadeMode == FADE_IN) {

        t = 1.0 - t;
    }
    
    tr.set_view(1, 1);
    tr.identity();
    tr.use_transform();
    
    graph.set_color(this.fadeColor.r, this.fadeColor.g, this.fadeColor.b, t);
    graph.fill_rectangle(0,0,1,1);
    graph.set_color(1, 1, 1, 1);
}


// Update
global.update = function(tm) {

    // Update key config
    kconf.update();

    // Update fading
    global.update_fading(tm);
}


// Draw
global.draw = function() {

    // Draw fading
    global.draw_fading();
}


// Change
global.on_change = function() {

}


// Fade
global.fade = function(mode, speed, color, cb) {

    this.fadeMode = mode;
    this.fadeSpeed = speed;
    this.fadeColor.r = color.r;
    this.fadeColor.b = color.b;
    this.fadeColor.g = color.g;
    this.fadeCb = cb;
    this.fading = true;
}


// Add scene
core.add_scene(new Scene(global.init, global.update, global.draw, global.on_change ));
