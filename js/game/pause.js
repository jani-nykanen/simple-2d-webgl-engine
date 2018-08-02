// Pause menu
// (c) 2018 Jani Nykänen

// Constants
const PAUSE_TIMER_MAX = 20.0;
const PAUSE_IN = 0;
const PAUSE_OUT = 1;
const PAUSE_BOX_WIDTH = 432;
const PAUSE_BOX_HEIGHT = 320;

const PAUSE_BUTTON_COUNT = 5;
const PAUSE_BUTTON_TEXT = [
    "Resume",
    "Restart",
    "Audio: On",
    "Full screen",
    "Main menu"
];
const PAUSE_AUDIO_BUTTONS = [
    "Audio: On", "Audio: Off"
];

const PAUSE_CALLBACKS = [

    function() {
        pause.fadeMode = PAUSE_OUT;
        pause.timer = PAUSE_TIMER_MAX;
    },
    function() {
        global.fade(FADE_IN, 2.0, null, function() {

            core.change_scene("game");
        });
    },
    function() { audio.toggle(!audio.enabled);  },
    function() { /* ... */ },
    function() { alert("Not implemented") ;}
]

// Pause object
pause = {};

// Is active
pause.active = false;
// Pause timer
pause.timer = 0.0;
// Pause fade mode
pause.fadeMode = 0;

// Buttons
pause.buttons = [];


// Initialize
pause.init = function() {

    // Create buttons
    for(var i = 0; i < PAUSE_BUTTON_COUNT; ++ i) {

        pause.buttons[i] = new Button(
            PAUSE_BUTTON_TEXT[i],
            -32, -32, 1024,
            0.75, true, PAUSE_CALLBACKS[i]
        );
    }

}


// Update pause screen
pause.update = function(tm) {

    const BUTTON_START = 32;
    const BUTTON_OFF = 64;

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

        // Update buttons
        for(var i = 0; i < pause.buttons.length; ++ i) {

            pause.buttons[i].update(tm);
        }

        core.request_full_screen (pause.buttons[3].overlay);

        // Position buttons
        tr.fit_view_height(CAMERA_HEIGHT);
        let y = tr.viewport.h/2 - PAUSE_BOX_HEIGHT/2 + BUTTON_START;
        let x = tr.viewport.w/2;
        for(var i = 0; i < pause.buttons.length; ++ i) {

            pause.buttons[i].update_pos(x, y + BUTTON_OFF * i);
        }

        // Set audio button text
        pause.buttons[2].text = PAUSE_AUDIO_BUTTONS[audio.enabled ? 0 : 1];
    }

}


// Draw the pause box
pause.draw_box = function() {

    const OUTER_W = 8;
    const INNER_W = 8;

    let sum = OUTER_W + INNER_W;

    let x = -PAUSE_BOX_WIDTH/2;
    let y = -PAUSE_BOX_HEIGHT/2;

    let w = PAUSE_BOX_WIDTH;
    let h = PAUSE_BOX_HEIGHT;

    graph.set_color(0.75, 0.75, 0.75, 0.75);
    graph.fill_rectangle(x - sum, y - sum, w + sum*2, h + sum*2);

    graph.set_color(0, 0, 0, 1);
    graph.fill_rectangle(x - INNER_W, y - INNER_W, w + INNER_W*2, h + INNER_W*2);

    graph.set_color(1, 1, 1, 1);
    graph.draw_scaled_bitmap_region(
        assets.bitmaps.bg,0,0,512,512,
        x , y, w , h );
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

    // Set transforms for The Box (tm)
    tr.push();
    tr.translate(tr.viewport.w / 2, tr.viewport.h / 2);
    tr.scale(t, t);
    tr.use_transform();

    // Draw box
    pause.draw_box();

    tr.pop();

    if(pause.timer <= 0.0) {
        // Draw buttons
        for(var i = 0; i < pause.buttons.length; ++ i) {

            pause.buttons[i].draw(assets.bitmaps.font, 1.0);
        }
    }

    // Draw controls
    t = Math.max(_status.guidePos, t);
    _status.draw_guide(t, 0, 0, true);
}


// Enable pause
pause.enable = function() {

    pause.active = true;
    pause.timer = PAUSE_TIMER_MAX;
    pause.fadeMode = PAUSE_IN;

    // Reset button scales
    for(var i = 0; i < pause.buttons.length; ++ i) {

        pause.buttons[i].reset_scale();
    }
}
