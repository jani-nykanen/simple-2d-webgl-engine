// Game object manager
// (c) 2018 Jani Nykänen

// Object manager object
objman = {};

// Initialize
objman.init = function() {

    objman.player = new Player(0, 0);
}


// Update object manager
objman.update = function(tm) {

    objman.player.update(tm);
}


// Draw game objects
objman.draw = function() {

    // Draw player
    objman.player.draw();
}
