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
}


// Update game
game.update = function(tm) {

    // Update objects
    objman.update(tm);

    // Limit camera
    cam.limit(AREA_WIDTH, AREA_HEIGHT);
}


// Draw game
game.draw = function() {

    tr.identity();
    cam.use();
    tr.use_transform();

    graph.clear(1, 1, 1);

    // Draw background
    bg.draw();

    // Draw game object shadows
    objman.draw(16,16,{r: 0, g: 0, b: 0, a: 0.35});
    // Draw game objects 
    objman.draw();
}


// On change
game.on_change = function() {

}


// Add scene
core.add_scene(new Scene(game.init, game.update, game.draw, game.on_change ));
