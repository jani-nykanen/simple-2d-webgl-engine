// Title screen scene
// (c) 2018 Jani Nykänen

// Constants
const LOGO_PHASE_MAX = 3;
const LOGO_PHASE_TIME = [
    60.0, 60.0, 60.0,
];
const LOGO_PL_TARGET = -144 - 64;
const LOGO_PL_INITIAL = -640;
const LOGO_PL_GRAV_MAX = 24.0;
const LOGO_PL_GRAVITY = 0.35;

const TITLE_BUTTON_COUNT = 4;
const TITLE_BUTTON_TEXT = [
    "Play game", "Leaderboard",
    "Audio: On", "Full screen"
];
const TITLE_AUDIO_TEXT = ["Audio: On", "Audio: Off"];
const TITLE_BUTTON_CB = [

    function() { 
        global.fade(FADE_IN, 2.0, null, function() {

        core.change_scene("game");
        });
    },
    function() { /* .. */ },
    function() {audio.toggle(!audio.enabled); },
    function() { /* .. */ },
]

// Title object
title = {};

// Phase timer
title.phaseTimer = 0.0;
// Logo phase
title.logoPhase = 0;
// Player position
title.plPos = LOGO_PL_INITIAL;
// Player gravity
title.plGravity = 0.0;

// Buttons
title.buttons = [];


// Initialize
title.init = function() {

    // Create buttons
    for(var i = 0; i < TITLE_BUTTON_COUNT; ++ i) {

        title.buttons[i] = new Button(
            TITLE_BUTTON_TEXT[i], -1, -1, 1024,
            0.75, true, TITLE_BUTTON_CB[i], false
        );
    }
}


// Update
title.update = function(tm) {

    if(global.fading) return;

    // Update phase timer
    if(title.logoPhase < LOGO_PHASE_MAX) {

        // Beautiful...
        let speed = (title.logoPhase == 0 && title.phaseTimer > LOGO_PHASE_TIME[title.logoPhase] / 2.0)
            ? 0.5 : 1.0;

        title.phaseTimer += speed * tm;
        if(title.phaseTimer >= LOGO_PHASE_TIME[title.logoPhase]) {

            // Start music (TEMPORARY!)
            if(title.logoPhase == 0) {

                audio.fade_in_music(assets.audio.theme, 0.25, 1000);
            }

            title.phaseTimer -= LOGO_PHASE_TIME[title.logoPhase];
            ++ title.logoPhase;
        }
    }

    // Update player position
    if(title.logoPhase > 0 && title.plPos < LOGO_PL_TARGET) {

        title.plGravity += LOGO_PL_GRAVITY * tm;
        if(title.plGravity > LOGO_PL_GRAV_MAX) {

            title.plGravity = LOGO_PL_GRAV_MAX;
        }

        title.plPos += title.plGravity * tm;
        if(title.plPos >= LOGO_PL_TARGET) {

            title.plPos = LOGO_PL_TARGET;
        }
    }

    if(title.logoPhase >= 2) {

        tr.fit_view_height(CAMERA_HEIGHT);

        const BUTTON_Y1 = -192;
        const BUTTON_Y2 = BUTTON_Y1 + 64;

        let x1 = tr.viewport.w / 3;
        let x2 = tr.viewport.w / 3 * 2;

        let y1 = tr.viewport.h + BUTTON_Y1;
        let y2 = tr.viewport.h + BUTTON_Y2;

        // Set button positions
        title.buttons[0].update_pos(x1, y1);
        title.buttons[1].update_pos(x1, y2);
        title.buttons[2].update_pos(x2, y1);
        title.buttons[3].update_pos(x2, y2);

        // Set audio button text
        title.buttons[2].text = TITLE_AUDIO_TEXT[audio.enabled ? 0 : 1];

        // Set full screen button
        core.request_full_screen (title.buttons[3].overlay);
    
        // Update buttons
        if(title.logoPhase == 3) {

            for(var i = 0; i < title.buttons.length; ++ i) {

                title.buttons[i].update(tm);
            }
        }
    }

    // Update background
    bg.update(tm);
}


// Draw logo
title.draw_logo = function(tx, ty) {

    const LOGO_Y = 64;
    const MONSTER_X = 0;
    const MONSTER_Y = -144-88;
    const PLAYER_X = -304;

    if(title.logoPhase > 0) {

        // Calculate monster pos
        let t = 0.0;
        if(title.logoPhase == 1) {

            t = 1.0 - title.phaseTimer / LOGO_PHASE_TIME[title.logoPhase];
        }
        let mpos = MONSTER_Y + 167*t;

        // Draw monster
        graph.draw_bitmap_region(assets.bitmaps.figures,
            256,0,256,33+56 + 167*(1.0-t),
            tx + MONSTER_X,ty +mpos, FLIP_H);
    }

    // Draw logo
    graph.draw_scaled_bitmap(assets.bitmaps.logo,
        tx -assets.bitmaps.logo.width/2,
        ty -assets.bitmaps.logo.height/2 + LOGO_Y, 
        1.0, 1.0);


    if(title.logoPhase > 0) {

        // Draw player
        graph.draw_bitmap_region(assets.bitmaps.figures,
            0,0,256,256,
            tx + PLAYER_X,ty + title.plPos, FLIP_H);
    }
 
}


// Draw
title.draw = function() {

    const BG_ALPHA = 0.5;
    const LOGO_SCALE = 1.25;
    const LOGO_FINAL_SCALE = 1.0 / 1.25;
    const LOGO_Y_TRANS = 256;
    const LOGO_MOVE_Y = -128;

    // Set view
    tr.identity();
    cam.set_scale(1, 1);
    cam.use();
    tr.use_transform();

    // Draw background
    bg.draw();

    // Draw logo
    let scale = 1.0;
    let tr_y = 0.0;
    let rot = 0.0;
    let t = title.phaseTimer / LOGO_PHASE_TIME[title.logoPhase];

    if(title.logoPhase == 0) {

        let max = LOGO_PHASE_TIME[title.logoPhase] / 2;
        if(title.phaseTimer < max)
            scale = title.phaseTimer / max;
        else
            scale = 1.0 + 0.5*Math.sin((title.phaseTimer-max) / max * Math.PI);

        tr_y = Math.cos(title.phaseTimer / (max*2) * (Math.PI * 3.0 / 2.0) ) * (-LOGO_Y_TRANS);

        rot = title.phaseTimer / (max*2) * Math.PI * 2;
    }
    else if(title.logoPhase == 2) {

        tr_y = t * LOGO_MOVE_Y;

        scale = 1.0 - t * (1.0 - LOGO_FINAL_SCALE);
    }
    else if(title.logoPhase == 3) {

        tr_y = LOGO_MOVE_Y;
        scale = LOGO_FINAL_SCALE;
    }

    tr.identity();
    tr.fit_view_height(CAMERA_HEIGHT);

    tr.push();
    tr.translate(tr.viewport.w/2, tr.viewport.h/2 + tr_y);
    tr.rotate(rot);
    tr.scale(LOGO_SCALE * scale, LOGO_SCALE * scale);
    tr.use_transform();

    graph.set_color(0,0,0,BG_ALPHA);
    title.draw_logo(12, 12);

    graph.set_color(1,1,1,1);
    title.draw_logo(0, 0);

    tr.pop();

    // Draw buttons & copyright
    if(title.logoPhase >= 2) {

        let alpha = 1.0;
        if(title.logoPhase < 3)
            alpha = t;

        // Draw buttons
        for(var i = 0; i < title.buttons.length; ++ i) {

            title.buttons[i].draw(assets.bitmaps.font, alpha);
        }

        // Draw copyright
        graph.set_color(1,1,1, alpha);

        graph.draw_text(assets.bitmaps.font,"(c)2018 Jani Nyk~nen",
            tr.viewport.w/2, tr.viewport.h-64, -24,0, true, 0.75);
        graph.set_color(1,1,1,1);
    }
}


// Changed to this scene
title.changed_to = function() {

    // Set buttons' overlay to false
    for(var i = 0; i < title.buttons.length; ++ i) {

        title.buttons[i].overlay = false;
    }
}


// Add scene
core.add_scene(new Scene(title.init, title.update, title.draw, title.changed_to ), "title");
