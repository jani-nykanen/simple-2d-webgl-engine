// Game scene
// (c) 2018 Jani Nykänen

// Constants
const AREA_WIDTH = 1280*2;
const AREA_HEIGHT = 1280*2;

// Game object
game = {};


// Make the game over
game.cause_game_over = function() {

    global.fade(FADE_IN, 1.0, null, function() {

        core.change_scene("gameover");
    });
}


// Initialize
game.init = function() {
    
    // Initialize object manager
    objman.init();
    // Initialize minimap
    miniMap.init();
}


// Reset game
game.reset = function() {

    // Reset components
    objman.reset();
    _status.reset();
    cam.reset();
}


// Update game
game.update = function(tm) {

    // If fading, update only certain things and stop
    if(global.fading) {

        cam.zoom(tm);
        cam.limit(AREA_WIDTH, AREA_HEIGHT);

        // Update minimap
        miniMap.update(tm);

        return;
    }

    // Update pause
    if(pause.active) {

        pause.update(tm);
        return;
    }
    // Pause
    if(!pause.active && 
        kconf.start.state == state.PRESSED) {

        pause.enable();
        return;
    }

    // Update objects
    objman.update(tm);

    // Update background
    bg.update(tm);

    // Limit camera
    cam.limit(AREA_WIDTH, AREA_HEIGHT);

    // Update status
    _status.update(tm);

    // Update minimap
    miniMap.update(tm);

    // DEBUG
    if(input.keyStates[KEY_P] == state.PRESSED) {

        _status.reduce_health(1.0);
    }
}


// Draw game
game.draw = function() {

    // Set view
    tr.identity();
    cam.use();
    tr.use_transform();

    // Clear background to white
    graph.clear(1, 1, 1);

    // Draw background
    bg.draw();

    // Draw game object shadows
    objman.draw(16,16,{r: 0, g: 0, b: 0, a: 0.35});
    // Draw game objects 
    objman.draw();

    // Reset view
    tr.fit_view_height(CAMERA_HEIGHT);
    tr.identity();
    tr.use_transform();

    // Draw HUD parts related to object manager
    objman.draw_hud();

    // Draw status (i.e. global HUD elements)
    _status.draw();

    // Draw minimap
    miniMap.draw(tr.viewport.w-272,16,1,1);

    // Draw pause
    if(pause.active) {

        pause.draw();
    }

    // If dead & fading, draw red
    if(_status.gameOver && global.fading) {

        let t = 1.0 - global.fadeTimer / FADE_MAX;
        graph.set_color(1, 0, 0, t);
        tr.set_view(1,1);
        tr.use_transform();

        graph.fill_rectangle(0,0,1,1);
    }
}


// On change
game.on_change = function() {

    // Reset game
    game.reset();

    // Set fade speed to 1.0
    global.fadeSpeed = 1.0;
}


// Add scene
core.add_scene(new Scene(game.init, game.update, game.draw, game.on_change ), "game");
