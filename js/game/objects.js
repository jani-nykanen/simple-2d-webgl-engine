// Game object manager
// (c) 2018 Jani Nykänen

// Constants
const GAS_COUNT = 32;
const CHAIN_COUNT = 6;

// Object manager object
objman = {};

// Initialize
objman.init = function() {

    //// Create components:
    // Player
    objman.player = new Player(0, 400);
    // Gas
    objman.gas = [];
    for(var i = 0; i < GAS_COUNT; ++ i) {

        objman.gas[i] = new Gas();
    }
    // Heart
    objman.heart = new Heart(0, 0);
    // Chains
    objman.chain = [];
    for(var i = 0; i < CHAIN_COUNT; ++ i) {

        objman.chain[i] = new Chain(
            objman.player.pos.x, objman.player.pos.y,
            i == 0 ? objman.player.butt : objman.chain[i-1],
            64, 1.5);
    }
    // Fetus
    objman.fetus = new Fetus(
        objman.player.pos.x, objman.player.pos.y+128,
        objman.chain[CHAIN_COUNT-1],64,1.33);
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

    // Update chain
    for(var i = 0; i < CHAIN_COUNT; ++ i) {

        objman.chain[i].update(tm);
    }

    // Update fetus
    objman.fetus.update(tm);
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

    // Draw chain
    for(var i = CHAIN_COUNT -1; i >= 0; -- i) {

        objman.chain[i].draw();
    }

    // Draw fetus
    objman.fetus.draw();

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
