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
objman.draw = function(tx, ty, color) {

    tx = tx || 0;
    ty = ty || 0;

    // Translate & set color, if desired
    if(color != null) {

        graph.set_color(color.r, color.g, color.b, color.a);
        graph.toggle_color_lock(true);
    }

    tr.push();
    tr.translate(tx, ty);

    // Draw player
    objman.player.draw();

    tr.pop();
    
    if(color != null) {
        
        graph.toggle_color_lock(false);
        graph.set_color(1.0, 1.0, 1.0, 1.0);
    }
    
}
