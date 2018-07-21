// Game object manager
// (c) 2018 Jani Nykänen

// Constants
const GAS_COUNT = 32;

// Object manager object
objman = {};

// Initialize
objman.init = function() {

    // Create components
    objman.player = new Player(0, 400);
    objman.gas = [];
    for(var i = 0; i < GAS_COUNT; ++ i) {

        objman.gas[i] = new Gas();
    }
    objman.heart = new Heart(0, 0);
}


// Update object manager
objman.update = function(tm) {

    // Update gas
    for(var i = 0; i < GAS_COUNT; ++ i) {

        objman.gas[i].update(tm);
    }

    // Update player
    objman.player.update(tm);
    // Check player-wall collisions
    objman.player.wall_collisions(AREA_WIDTH, AREA_HEIGHT);

    // Update heart
    objman.heart.update(tm);
    objman.heart.player_collision(objman.player);
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
    tr.use_transform();

    // Draw heart
    objman.heart.draw();

    // Draw gas
    for(var i = 0; i < GAS_COUNT; ++ i) {

        objman.gas[i].draw();
    }

    // Draw player
    objman.player.draw();

    tr.pop();
    
    if(color != null) {
        
        graph.toggle_color_lock(false);
        graph.set_color(1.0, 1.0, 1.0, 1.0);
    }
    
}


// Add gas
objman.add_gas = function(x, y, speed, scale) {

    let gas = objman.gas[0];
    for(var i = 0; i < GAS_COUNT; ++ i) {

        if(!objman.gas[i].exist) {

            gas = objman.gas[i];
            break;
        }
    }

    gas.create_instance(x,y,speed,scale);
}
