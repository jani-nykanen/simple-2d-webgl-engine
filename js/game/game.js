// Game scene
// (c) 2018 Jani Nykänen

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
}


// Draw game
game.draw = function() {

    tr.identity();
    cam.use();
    tr.use_transform();

    graph.clear(1, 1, 1);

    // Draw background
    bg.draw();

    // Draw game objects
    objman.draw();
    
}


// On change
game.on_change = function() {

}


// Add scene
core.add_scene(new Scene(game.init, game.update, game.draw, game.on_change ));
