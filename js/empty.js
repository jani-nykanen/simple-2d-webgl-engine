// An empty scene (well, not really)
// (c) 2018 Jani Nykänen

// Constant
const EMPTY_TIMER_MAX = 120.0;


// Empty scene object
empty = {};

// Timer
empty.timer = EMPTY_TIMER_MAX;


// Initialize
empty.init = function() {

    // ...
}


// Update
empty.update = function(tm) {

    empty.timer -= 1.0 * tm;
    if(empty.timer <= 0.0) {

        global.fade(FADE_OUT, 1.0, null, null);
        core.change_scene("game");

        if(!global.spcTextShown) {
            
            global.drawSpcText = true;
            global.spcTextShown = true;
        }
    }
}


// Draw
empty.draw = function() {

    graph.clear(1.0, 1.0, 1.0);

    tr.fit_view_height(CAMERA_HEIGHT);
    tr.identity();
    tr.use_transform();

    graph.draw_text(assets.bitmaps.font, SPC_TEXT,
        tr.viewport.w/2,tr.viewport.h/2-32,-24,0, true, 1.0);
}


// Change to
empty.changed_to = function() {

    // ...
}


// Add scene
core.add_scene(new Scene(empty.init, empty.update, empty.draw, empty.changed_to ), "empty");
