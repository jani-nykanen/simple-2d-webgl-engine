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


// Initialize
title.init = function() {

    // Init buttons etc
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
    const LOGO_Y_TRANS = 256;
    const LOGO_MOVE_Y = -96;

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

        tr_y = title.phaseTimer / LOGO_PHASE_TIME[title.logoPhase] * LOGO_MOVE_Y;
    }
    else if(title.logoPhase == 3) {

        tr_y = LOGO_MOVE_Y;
    }

    tr.identity();
    tr.fit_view_height(CAMERA_HEIGHT);
    tr.translate(tr.viewport.w/2, tr.viewport.h/2 + tr_y);
    tr.rotate(rot);
    tr.scale(LOGO_SCALE * scale, LOGO_SCALE * scale);
    tr.use_transform();

    graph.set_color(0,0,0,BG_ALPHA);
    title.draw_logo(12, 12);

    graph.set_color(1,1,1,1);
    title.draw_logo(0, 0);
}


// Changed to this scene
title.changed_to = function() {

    title.logoPhase = 0;
    title.phaseTimer = 0.0;
}


// Add scene
core.add_scene(new Scene(title.init, title.update, title.draw, title.changed_to ), "title");
