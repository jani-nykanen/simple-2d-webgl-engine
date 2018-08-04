// Intro scene
// (c) 2018 Jani Nykänen

// Constants
const INTRO_MAX = 150;
const INTRO_FADE = 30;


// Intro scene object
intro = {};

// Intro phase
intro.phase = 0;
// Intro timer
intro.timer = 0.0;


// Initialize
intro.init = function() {

    // ...
}


// Update
intro.update = function(tm) {

    const MUSIC_FADE_TIME = 1000;

    // Update background
    bg.update(tm);

    if(global.fading) return;

    // Update timer
    intro.timer += 1.0 * tm;
    if(intro.timer >= INTRO_MAX) {

        if(intro.phase ++ == 1) {

            // Scene to title
            core.change_scene("title");

            // Start music
            audio.fade_in_music(assets.audio.theme,MUSIC_VOLUME, MUSIC_FADE_TIME);
        }
        else {

            intro.timer -= INTRO_MAX;
        }
    }
    
    // Skip
    if(kconf.start.state == state.PRESSED) {
        
        core.change_scene("title");
        audio.fade_in_music(assets.audio.theme,MUSIC_VOLUME, MUSIC_FADE_TIME);
        title.logoPhase = LOGO_PHASE_MAX;
    }
}


// Draw
intro.draw = function() {

    const SCALE = 1.5;

    // Set view
    tr.identity();
    cam.set_scale(1, 1);
    cam.use();
    tr.use_transform();
 
    // Draw background
    bg.draw();

    // Draw intro image
    tr.fit_view_height(CAMERA_HEIGHT);
    tr.identity();
    tr.use_transform();

    let alpha = 1.0;
    if(intro.timer < INTRO_FADE) {

        alpha = intro.timer / INTRO_FADE;
    }
    else if(intro.timer >= INTRO_MAX - INTRO_FADE) {

        alpha = (INTRO_MAX - intro.timer) / INTRO_FADE;
    }
    graph.set_color(1,1,1, alpha);

    let bmp = assets.bitmaps.intro;
    let x = tr.viewport.w / 2 - bmp.height/2 * SCALE;
    let y = tr.viewport.h / 2 - bmp.height/2 * SCALE;

    graph.draw_scaled_bitmap_region(bmp,intro.phase*bmp.height, 0, bmp.height,bmp.height,
        x,y,bmp.height*SCALE,bmp.height*SCALE, 0);

        graph.set_color(1,1,1,1);
}


// Add scene
core.add_scene(new Scene(intro.init, intro.update, intro.draw, null), "intro");
