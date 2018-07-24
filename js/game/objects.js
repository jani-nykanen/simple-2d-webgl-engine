// Game object manager
// (c) 2018 Jani Nykänen

// Constants
const GAS_COUNT = 32;
const CHAIN_COUNT = 6;
const ANIMAL_COUNT = 32;
const EXP_COUNT = 8;
const POW_COUNT = 32;

const ANIMAL_TIME_WAIT_MIN = 60.0;
const ANIMAL_TIME_WAIT_VARY = 180.0;
const ANIMAL_WAIT_INITIAL = 60.0;
const ANIMAL_MAX_CREATE = 3;

// Object manager object
objman = {};

// Animal creation timer
objman.animalTimer = 0.0;
// Animal timer wait
objman.animalWait = ANIMAL_WAIT_INITIAL;


// Get the next object in an array
objman.next_obj = function(arr, cond2) {

    if(cond2 == null)
        cond2 = false;

    for(var i = 0; i < arr.length; ++ i) {

        if(arr[i].exist == false &&
          (cond2 || arr[i].dying == false) ) {

            return arr[i];
        }
    }

    return null;
}


// Update objects in an array
objman.update_obj = function(arr, tm) {

    for(var i = 0; i < arr.length; ++ i) {

        arr[i].update(tm);
    }
}


// Draw objects in an array
objman.draw_obj = function(arr) {

    for(var i = 0; i < arr.length; ++ i) {

        arr[i].draw();
    }
}


// Create an animal to a random position
objman.create_animal = function() {

    const ANIMAL_MIN_SIZE = 1.0;
    const ANIMAL_SIZE_VARY = 1.0;
    const SPEED_MOD = 3; 
    const MAX_SPEED = 8.0;

    var next = this.next_obj(objman.animals);
    if(next == null) return;

    var scale = ANIMAL_MIN_SIZE + Math.random() * ANIMAL_SIZE_VARY;
    var radius = 128 * scale;
    var totalSpeed = MAX_SPEED- scale * SPEED_MOD;

    var mode = Math.floor(Math.random()* 4);
    var x = 0;
    var y = 0;
    var sx = 0;
    var sy = 0;
    var angle = 0;

    switch(mode) {

    // Top
    case 0:
        y = -radius - AREA_HEIGHT/2;
        x = (-AREA_WIDTH/2 + radius/2) + Math.random() * (AREA_WIDTH-radius);
        angle = Math.PI + Math.PI / 4 + Math.random() * Math.PI/2.0;

        break;

    // Bottom
    case 1:
        y = radius + AREA_HEIGHT/2;
        x = (-AREA_WIDTH/2 + radius/2) + Math.random() * (AREA_WIDTH-radius);

        angle = Math.PI / 4 + Math.random() * Math.PI/2.0;

        break;

    // Left
    case 2:
        x = -radius - AREA_WIDTH/2;
        y = (-AREA_HEIGHT/2 + radius/2) + Math.random() * (AREA_HEIGHT-radius);

        angle = -Math.PI / 4 + Math.random() * Math.PI/2.0;

        break;

    // Right
    case 3:
        x = radius + AREA_WIDTH/2;
        y = (-AREA_HEIGHT/2 + radius/2) + Math.random() * (AREA_HEIGHT-radius);

        angle = Math.PI - Math.PI / 4 + Math.random() * Math.PI/2.0;

        break;

    default:
        break;
    }

    sx = Math.cos(angle) * totalSpeed;
    sy = -Math.sin(angle) * totalSpeed;

    next.create_self(x, y, sx, sy, scale);
}


// Handle object creation
objman.create_objects = function(tm) {

    // Handle animal creation
    objman.animalTimer += 1.0 * tm;

    if(objman.animalTimer >= objman.animalWait) {

        var loop = 1 + Math.floor(Math.random() * ANIMAL_MAX_CREATE);
        
        for(var i = 0; i < loop; ++ i) {

            this.create_animal();
        }

        objman.animalTimer -= objman.animalWait;
        objman.animalWait = ANIMAL_TIME_WAIT_MIN + Math.random()* ANIMAL_TIME_WAIT_VARY;
    }
}


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
    // Animals
    objman.animals = [];
    for(var i = 0; i < ANIMAL_COUNT; ++ i) {

        objman.animals[i] = new Animal();
    }
    // Explosions
    objman.explosions = [];
    for(var i = 0; i < EXP_COUNT; ++ i) {

        objman.explosions[i] = new Explosion();
    }
    // Pows
    objman.pows = [];
    for(var i = 0; i < POW_COUNT; ++ i) {

        objman.pows[i] = new Pow();
    }
}


// Update object manager
objman.update = function(tm) {

    // Create objects
    objman.create_objects(tm);

    // Update gas
    objman.update_obj(objman.gas, tm);
    // Update pos
    objman.update_obj(objman.pows, tm);

    // Update player
    objman.player.update(tm);
    // Check player-wall collisions
    objman.player.wall_collisions(AREA_WIDTH, AREA_HEIGHT);

    // Update heart
    objman.heart.update(tm);
    objman.heart.object_collision(objman.player);

    // Update chain
    objman.update_obj(objman.chain, tm);
    // Update explosions
    objman.update_obj(objman.explosions, tm);

    // Update fetus
    objman.fetus.update(tm);

    // Update animals
    for(var i = 0; i < ANIMAL_COUNT; ++ i) {

        objman.animals[i].update(tm);
        // Collide with player
        objman.animals[i].object_collision(objman.player);
        // Collide with heart
        objman.animals[i].object_collision(objman.heart);
        
        if(objman.animals[i].exist) {
            
            for(var i2 = 0; i2 < ANIMAL_COUNT; ++ i2) {
                // Collide with other animals
                if(i != i2) {

                    objman.animals[i].object_collision(objman.animals[i2]);
                }
                // Collide with explosions
                if(i2 < EXP_COUNT) {

                    objman.animals[i].exp_collision(objman.explosions[i2]);
                }
            }
        }
        // Collide with fetus
        objman.fetus.object_collision(objman.animals[i]);
        // Magnet interaction
        objman.animals[i].magnet_interaction(objman.fetus, tm);
    }
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

    // Draw animals
    objman.draw_obj(objman.animals);
    // Draw chain
    objman.draw_obj(objman.chain);

    // Draw fetus
    objman.fetus.draw();

    // Draw gas
    objman.draw_obj(objman.gas);

    // Draw player
    objman.player.draw();

    // Update pos
    objman.draw_obj(objman.pows);

    // Draw explosion
    objman.draw_obj(objman.explosions);

    tr.pop();
    
    if(color != null) {
        
        graph.toggle_color_lock(false);
        graph.set_color(1.0, 1.0, 1.0, 1.0);
    }
    
}


// Add gas
objman.add_gas = function(x, y, speed, scale) {

    let g = objman.next_obj(objman.gas, true);
    g = g || objman.gas[0];

    g.create_self(x, y, speed, scale);
}


// Add an explosion
objman.add_explosion = function(x, y, speed, scale) {

    let e = objman.next_obj(objman.explosions);
    e = e || objman.explosions[0];

    e.create_self(x, y, speed, scale);
}


// Add a pow
objman.add_pow = function(x, y, speed, scale) {

    let p = objman.next_obj(objman.pows, true);
    p = p || objman.pows[0];

    p.create_self(x, y, speed, scale);
}
