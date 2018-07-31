// Pause menu
// (c) 2018 Jani Nykänen

// Constants
const PAUSE_TIMER_MAX = 20.0;
const PAUSE_IN = 0;
const PAUSE_OUT = 1;

// Pause object
pause = {};

// Is active
pause.active = false;
// Pause timer
pause.timer = 0.0;
// Pause fade mode
pause.fadeMode = 0;


// Initialize
pause.init = function() {

    // ...
}


// Update pause screen
pause.update = function(tm) {

    // Update timer
    if(pause.timer > 0.0) {

        pause.timer -= 1.0 * tm;
        if(pause.timer <= 0.0 &&
            pause.fadeMode == FADE_OUT) {

            pause.active = false;
        }
    }
    else {

        // If pause key pressed
        if(kconf.start.state == state.PRESSED) {

            pause.fadeMode = PAUSE_OUT;
            pause.timer = PAUSE_TIMER_MAX;
        }
    }
}


// Draw pause
pause.draw = function() {

    const ALPHA = 0.5;

    // Draw background
    tr.set_view(1, 1);
    tr.identity();
    tr.use_transform();

    // Clear with alpha color
    let t = pause.timer / PAUSE_TIMER_MAX;
    if(pause.fadeMode == PAUSE_IN) {

        t = 1.0 - t;
    }

    graph.set_color(0,0,0,t * ALPHA);
    graph.fill_rectangle(0,0,1,1);
    graph.set_color(1,1,1,1);

    tr.fit_view_height(CAMERA_HEIGHT);
    tr.use_transform();

    // ...
}


// Enable pause
pause.enable = function() {

    pause.active = true;
    pause.timer = PAUSE_TIMER_MAX;
    pause.fadeMode = PAUSE_IN;
}
