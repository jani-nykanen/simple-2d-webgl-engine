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

const MONSTER_COUNTER_MIN = 3;
const MONSTER_COUNTER_VARY = 3;

const MISSILE_COUNTER_MIN = 3;
const MISSILE_COUNTER_VARY = 3;

// TODO: Rename : ANIMAL -> CREATURE
const ANIMAL_NORMAL = 0;
const ANIMAL_MONSTER = 1;
const ANIMAL_MISSILE = 2;

// Object manager object
objman = {};

// Animal creation timer
objman.animalTimer = 0.0;
// Animal timer wait
objman.animalWait = ANIMAL_WAIT_INITIAL;
// Monster counter
objman.monsterCounter = 0;
// Missile counter
objman.missileCounter = 0;


// Get the next object in an array
objman.next_obj = function(arr, cond2) {

    if(cond2 == null)
        cond2 = false;

    for(var i = 0; i < arr.length; ++ i) {

        if(arr[i].exist == false &&
          (cond2 || arr[i].dying == false) ) {

            return i;
        }
    }

    return 0;
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
objman.create_animal = function(type) {

    const ANIMAL_MIN_SIZE = 1.0;
    const ANIMAL_SIZE_VARY_FACTOR = 0.25;
    const SPEED_MOD = 3; 
    const MAX_SPEED = 8.0;

    const MONSTER_MIN_SPEED = 3.0;
    const MONSTER_SPEED_VARY = 2.0;

    let i = this.next_obj(objman.creatures);
    if(i == null) return;

    let scale = ([ANIMAL_MIN_SIZE + Math.floor(Math.random()*5) * ANIMAL_SIZE_VARY_FACTOR,
                 MONSTER_BASE_SCALE,
                 MISSILE_BASE_SCALE]) [type];

    let radius = 128 * scale;
    let totalSpeed = ([MAX_SPEED- scale * SPEED_MOD,
        MONSTER_MIN_SPEED + Math.random()* MONSTER_SPEED_VARY,
        2.0]) 
        [type];

    let mode = Math.floor(Math.random()* 4);
    let x = 0;
    let y = 0;
    let sx = 0;
    let sy = 0;
    let angle = 0;

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

    // If monster or missile, move towards the core
    if(type == ANIMAL_MONSTER) {

        angle = Math.atan2(y, x);
        sx = -Math.cos(angle) * totalSpeed;
        sy = -Math.sin(angle) * totalSpeed;

        objman.creatures[i] = new Monster();
    }
    else if(type == ANIMAL_MISSILE) {

        angle = Math.atan2(y, x);
        sx = -Math.cos(angle) * totalSpeed;
        sy = -Math.sin(angle) * totalSpeed;

        objman.creatures[i] = new Missile();
    }
    else {

        sx = Math.cos(angle) * totalSpeed;
        sy = -Math.sin(angle) * totalSpeed;

        objman.creatures[i] = new Animal();
    }

    
    objman.creatures[i].create_self(x, y, sx, sy, scale, type);
}


// Handle object creation
objman.create_objects = function(tm) {

    // Handle animal creation
    objman.animalTimer += 1.0 * tm;

    if(objman.animalTimer >= objman.animalWait) {

        var loop = 1 + Math.floor(Math.random() * ANIMAL_MAX_CREATE);
        
        -- objman.monsterCounter;
        -- objman.missileCounter

        for(var i = 0; i < loop; ++ i) {

            let type = ANIMAL_NORMAL;
            // First, check if we want to create a monster
            if(objman.monsterCounter <= 0) {

                objman.monsterCounter = Math.floor(Math.random() * MONSTER_COUNTER_VARY)
                    + MONSTER_COUNTER_MIN;

                type = ANIMAL_MONSTER;
            }
            // If not, maybe a missile
            else if(objman.missileCounter <= 0) {
                
                objman.missileCounter = Math.floor(Math.random() * MISSILE_COUNTER_VARY)
                    + MISSILE_COUNTER_MIN;

                type = ANIMAL_MISSILE;
            }

            this.create_animal(type);
        }

        objman.animalTimer -= objman.animalWait;
        objman.animalWait = ANIMAL_TIME_WAIT_MIN + Math.random()* ANIMAL_TIME_WAIT_VARY;
    }
}


// Reset
objman.reset = function() {

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
    // creatures
    objman.creatures = [];
    for(var i = 0; i < ANIMAL_COUNT; ++ i) {

        objman.creatures[i] = new Animal();
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
objman.init = objman.reset;


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
    // Collide with explosions
    for(var i = 0; i < EXP_COUNT; ++ i) {

        // Player-explosion
        objman.player.exp_collision(objman.explosions[i]);
        // Heart-explosion
        objman.heart.exp_collision(objman.explosions[i]);
    }

    // Update heart
    objman.heart.update(tm);
    objman.player.object_collision(objman.heart);

    // Update chain
    objman.update_obj(objman.chain, tm);
    // Update explosions
    objman.update_obj(objman.explosions, tm);

    // Update fetus
    objman.fetus.update(tm);

    // Update creatures
    for(var i = 0; i < ANIMAL_COUNT; ++ i) {

        objman.creatures[i].update(tm);
        // Collide with player
        objman.creatures[i].player_collision(objman.player);
        // Collide with heart
        objman.creatures[i].heart_collision(objman.heart);
        
        if(objman.creatures[i].exist) {
            
            for(var i2 = 0; i2 < ANIMAL_COUNT; ++ i2) {
                // Collide with other creatures
                if(i != i2) {

                    objman.creatures[i].object_collision(objman.creatures[i2]);
                }
                // Collide with explosions
                if(i2 < EXP_COUNT) {

                    objman.creatures[i].exp_collision(objman.explosions[i2]);
                }
            }
        }
        // Collide with fetus
        objman.fetus.object_collision(objman.creatures[i]);
        // Magnet interaction
        objman.creatures[i].magnet_interaction(objman.fetus, tm);
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

    // Draw chain
    objman.draw_obj(objman.chain);

    // Draw gas
    objman.draw_obj(objman.gas);

    // Draw creatures
    objman.draw_obj(objman.creatures);

    // Draw fetus
    objman.fetus.draw();

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


// Draw hud elements
objman.draw_hud = function() {

    // Draw animal arrows
    for(var i = 0; i < ANIMAL_COUNT; ++ i) {

        objman.creatures[i].draw_arrow();
    }
    graph.set_color(1,1,1,1);
}


// Add gas
objman.add_gas = function(x, y, speed, scale) {

    let g = objman.gas[objman.next_obj(objman.gas, true)];
    g.create_self(x, y, speed, scale);
}


// Add an explosion
objman.add_explosion = function(x, y, speed, scale) {

    let e = objman.explosions[objman.next_obj(objman.explosions)];
    e.create_self(x, y, speed, scale);
}


// Add a pow
objman.add_pow = function(x, y, speed, scale) {

    let p = objman.pows[objman.next_obj(objman.pows, true)];

    p.create_self(x, y, speed, scale);
}


// Add an animal
objman.add_animal = function(x, y, angle, speed, scale, eindex, skeleton) {

    let sx = Math.cos(angle) * speed;
    let sy = Math.sin(angle) * speed;

    let i = objman.next_obj(objman.creatures);
    if(i == 0 && (objman.creatures[i].exist || objman.creatures[i].dying) )
        return;

    objman.creatures[i] = new Animal();
    objman.creatures[i].create_self(x, y, sx, sy, scale, skeleton);
    objman.creatures[i].eindex = eindex;

    return objman.creatures[i];
}
