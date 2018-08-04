// Leaderboard
// (c) 2018 Jani Nykänen

// Constants
const URL = "http://localhost:8081";
const MAX_SCORES = 15;

const LB_BOX_WIDTH = 640;
const LB_BOX_HEIGHT = 640;

// Leaderboard object
lb = {};

// Is active
lb.active = false;
// Callback for continue button
lb.continueCb = null;

// Data
lb.data = {
    names: new Array(MAX_SCORES),
    scores: new Array(MAX_SCORES)
};

// Continue button
lb.buttonContinue = null;


// Initialize
lb.init = function() {

    // Set default names & scores
    for(var i = 0; i < MAX_SCORES; ++ i) {

        lb.data.names[i] = "Default";
        lb.data.scores[i] = 0;
    }

    // Create buttons
    lb.buttonContinue = 
        new Button("Continue",-999,-999,1024,0.75, true,
        function() { 
            lb.active = false;
        }, false);
}


// Update leaderboard
lb.update = function(tm) {

    // Update buttons & their positions
    tr.fit_view_height(CAMERA_HEIGHT);
    lb.buttonContinue.update_pos(
        tr.viewport.w/2,tr.viewport.h/2+LB_BOX_HEIGHT/2 - 40);
    
    lb.buttonContinue.update(tm);
}


// Draw leaderboard
lb.draw = function() {

    const ALPHA = 0.5;
    const SCORE_YOFF = 33;
    const SCORE_Y_START = 64;
    const TIME_X = 64;

    // Fill
    tr.push();
    tr.identity();
    tr.use_transform();

    graph.set_color(0,0,0, ALPHA);
    graph.fill_rectangle(0,0,tr.viewport.w, tr.viewport.h);
    graph.set_color(1,1,1, 1);

    tr.pop();

    tr.push();
    tr.translate(tr.viewport.w/2, tr.viewport.h/2);
    tr.use_transform();

    // Draw box
    util.draw_box(LB_BOX_WIDTH, LB_BOX_HEIGHT);

    // Leaderboard text
    graph.draw_text(assets.bitmaps.font, "LEADERBOARD",
        0, -LB_BOX_HEIGHT/2 + 16, -24,0, true, 0.625  
    );

    // Draw scores
    let y = -LB_BOX_HEIGHT/2 + SCORE_Y_START;
    for(var i = 0; i < MAX_SCORES; ++ i) {

        // Draw names
        graph.draw_text(assets.bitmaps.font, 
            (i < 9 ? "0" : "") + String(i+1) + "." + lb.data.names[i],
            -LB_BOX_WIDTH/2 + 16, y + i*SCORE_YOFF, -24,0, false, 0.625);

        // Draw scores
        graph.draw_text(assets.bitmaps.font, 
            util.get_time_string(lb.data.scores[i]),
            TIME_X, y + i*SCORE_YOFF, -24,0, false, 0.625);
    }

    tr.pop();
    tr.identity();
    tr.use_transform();

    // Draw continue button
    lb.buttonContinue.draw(assets.bitmaps.font, 1.0);

    
}


// Activate
lb.activate = function() {

    lb.active = true;
}
