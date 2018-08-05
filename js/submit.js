// Submit box
// (c) 2018

// Constants
const SUBMIT_BOX_WIDTH = 480;
const SUBMIT_BOX_HEIGHT = 256;
const SUBMIT_TIMER_MAX = 30;
const SUBMIT_IN = 0;
const SUBMIT_OUT = 1;
const SUBMIT_UNDERLINE_PHASE = 30;
const MAX_NAME_LENGTH = 12;

// Submit box object
submit = {};

// Submit timer
submit.timer = 0.0;

// Is active
submit.active = false;

// Button
submit.button = null;

// Name
submit.name = "";
// Underline timer
submit.underlineTimer = 0.0;


// Initialize
submit.init = function() {

    // Create button
    submit.button = new Button(
        "Submit",-999,-999,1024,0.75, true,
        function() { 

            if(submit.name.length <= 0) return;

            submit.active = false;
            lb.activate(true);
            lb.add_score(submit.name, _status.time);

        }, false
    );
}


// Update submit box
submit.update = function(tm) {

    // Update timer
    if(submit.timer > 0.0) {

        submit.timer -= 1.0 * tm;
    }
    else {

        // Update buttons & their positions
        tr.fit_view_height(CAMERA_HEIGHT);
        submit.button.update_pos(
            tr.viewport.w/2,tr.viewport.h/2+SUBMIT_BOX_HEIGHT/2 - 40);
        
        submit.button.update(tm);

        // Add text to the text field
        if(input.charBuffer != "") {

            submit.name += input.charBuffer;
        }
        else if(submit.name.length > 0
            && input.key_state(KEY_BACKSPACE) == state.PRESSED) {

            submit.name = submit.name.substr(0, submit.name.length -1);
        }

        if(submit.name.length > MAX_NAME_LENGTH) {

            submit.name = submit.name.substr(0, MAX_NAME_LENGTH);
        }

        // Update underline timer
        submit.underlineTimer += 1.0 * tm;
        if(submit.underlineTimer >= SUBMIT_UNDERLINE_PHASE * 2) {

            submit.underlineTimer -= SUBMIT_UNDERLINE_PHASE*2;
        }

    }
}


// Draw submit box
submit.draw = function() {

    const ALPHA = 0.5;

    let t = submit.timer / SUBMIT_TIMER_MAX;
    if(submit.mode == SUBMIT_IN) {

        t = 1.0 - t;
    }

    // Fill
    tr.push();
    tr.identity();
    tr.use_transform();

    graph.set_color(0,0,0, ALPHA * t);
    graph.fill_rectangle(0,0,tr.viewport.w, tr.viewport.h);
    graph.set_color(1,1,1, 1);

    tr.pop();

    tr.push();
    tr.translate(tr.viewport.w/2, tr.viewport.h/2);
    tr.scale(t, t);
    tr.use_transform();

    // Draw box
    util.draw_box(SUBMIT_BOX_WIDTH, SUBMIT_BOX_HEIGHT);

    if(submit.timer <= 0.0) {

        // Draw "enter name"
        graph.draw_text(assets.bitmaps.font, "Enter your name", 0, -SUBMIT_BOX_HEIGHT/2 + 16, -24, 0, true, 0.625);

        // Draw name
        let out = submit.name;
        if(out.length < MAX_NAME_LENGTH 
            && submit.underlineTimer < SUBMIT_UNDERLINE_PHASE) {

            out += "_";
        }
        graph.draw_text(assets.bitmaps.font, out, -SUBMIT_BOX_WIDTH/2 + 48, 
            -16, -24, 0, false, 0.75);
    }

    tr.pop();
    
    if(submit.timer <= 0.0) {

        tr.identity();
        tr.use_transform();
        // Draw button
        submit.button.draw(assets.bitmaps.font, 1.0);
    }
}


// Activate submit
submit.activate = function() {

    submit.timer = SUBMIT_TIMER_MAX;
    submit.mode = SUBMIT_IN;
    submit.active = true;
}
