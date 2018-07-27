// Game scene
// (c) 2018 Jani Nykänen

// Constants
const AREA_WIDTH = 1280*2;
const AREA_HEIGHT = 1280*2;

// Game object
game = {};


// Initialize
game.init = function() {
    
    // Initialize object manager
    objman.init();
    // Initialize minimap
    miniMap.init();
}


// Update game
game.update = function(tm) {

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
}


// On change
game.on_change = function() {

}


// Add scene
core.add_scene(new Scene(game.init, game.update, game.draw, game.on_change ));
