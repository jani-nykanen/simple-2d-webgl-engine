// Game over scene
// (c) 2018 Jani Nykänen

// Constants
const DUCK_TARGET = 416.0;
const DUCK_GRAV_MAX = 32.0;
const DUCK_GRAV_DELTA = 0.5;
const DUCK_TIMER_SPEED = 0.1;
const DUCK_WAVE_SPEED = 0.0625;
const DUCK_AMPLITUDE = 24.0;
const GAME_OVER_TEXT_SPEED = 7.0;
const GAME_OVER_TEXT_START = 752;

// Game over scene object
gameover = {};

// Duck position
gameover.duckPos = 0.0;
// Duck timer
gameover.duckTimer = 0.0;
// Duck gravity
gameover.duckGrav = 0.0;

// Text position
gameover.textPos = GAME_OVER_TEXT_START;
// Letter wave timer
gameover.letterWave = 0.0;


// Draw a duck
gameover.draw_duck = function() {

    const SCALE = 1.5;

    let x = tr.viewport.w / 2.0 - 128 * SCALE;
    let t = Math.sin(-gameover.duckTimer) * 0.5;
    let ht = 256.0 * (SCALE);
    let vt = 256.0 * (SCALE+t);

    let shadowScale = 256 * (0.5 + 0.5 * (gameover.duckPos / DUCK_TARGET ) ) * SCALE;

    // Draw shadow
    graph.draw_scaled_bitmap_region(assets.bitmaps.duck,
        256,0,256,256,
        tr.viewport.w / 2.0 - shadowScale / 2,
        DUCK_TARGET - shadowScale,shadowScale,shadowScale, 0);

    // Draw duck
    graph.draw_scaled_bitmap_region(assets.bitmaps.duck,
        0,0,256,256,
        x,gameover.duckPos - vt, ht,vt, 0);

}


// Initialize
gameover.init = function() {

    // ...
}


// Update
gameover.update = function(tm) {

    // Update gravity
    gameover.duckGrav += DUCK_GRAV_DELTA * tm;
    if(gameover.duckGrav > DUCK_GRAV_MAX) {

        gameover.duckGrav = DUCK_GRAV_MAX;
    }

    // Make fall
    gameover.duckPos += gameover.duckGrav * tm;
    if(gameover.duckPos >= DUCK_TARGET) {

        gameover.duckPos = DUCK_TARGET;

        // Update timer
        if(gameover.duckTimer < Math.PI*2) {

            gameover.duckTimer += DUCK_TIMER_SPEED * tm;
            if(gameover.duckTimer >= Math.PI*2)
                gameover.duckTimer = Math.PI * 2;
        }

    }

    // Make text go upwards
    if(gameover.textPos > DUCK_TARGET) {

        gameover.textPos -= GAME_OVER_TEXT_SPEED * tm;
    }
    else {

        gameover.textPos = DUCK_TARGET;

        // Update letter wave
        gameover.letterWave += DUCK_WAVE_SPEED * tm;
    }
}


// Draw
gameover.draw = function() {

    const VIEW_HEIGHT = 720.0;

    tr.fit_view_height(VIEW_HEIGHT);
    tr.identity();
    tr.use_transform();

    graph.clear(1, 1, 1);

    // Draw duck
    gameover.draw_duck();

    // Draw "Game over!" text
    graph.set_color(1, 0.5, 0.5, 1);
    let tx = tr.viewport.w / 2.0;
    let ty = gameover.textPos;
    graph.draw_waving_text(assets.bitmaps.font, 
        "GAME OVER!", tx, ty,
         -24, 0, true, gameover.letterWave, DUCK_AMPLITUDE, 6,  1.6);
    graph.set_color(1, 1, 1, 1);

}


// Change to game over scene
gameover.changed_to = function() {

    // Reset variables
    gameover.duckPos = 0.0;
    gameover.duckTimer = 0.0;
    gameover.duckGrav = 0.0;
    gameover.letterWave = 0.0;
    gameover.textPos = GAME_OVER_TEXT_START;
}


// Add scene
core.add_scene(new Scene(gameover.init, gameover.update, gameover.draw, gameover.changed_to ), "gameover");

