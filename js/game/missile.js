// Missile
// (c) 2018 Jani Nykänen

// Constants
const MISSILE_DEATH_MAX = 30.0;
const MISSILE_WEIGHT = 1.5;
const MISSILE_ACC = 0.05;
const MISSILE_TARGET = 8.0;
const MISSILE_EXP_RADIUS = 2.5;
const MISSILE_GAS_WAIT = 12.0;
const MISSILE_BASE_SCALE = 1.25;


// Missile constructor
var Missile = function() {

    CollisionObject.call(this);

    this.radius = 1;
    this.offscreen = false;

    this.isMissile = true;
}
Missile.prototype = Object.create(CollisionObject.prototype);


// Create the Missile
Missile.prototype.create_self = function(x, y, sx, sy, scale) {

    this.pos.x = x;
    this.pos.y = y;
    
    this.speed.x = sx;
    this.speed.y = sy;

    this.target = {x: 0, y: 0};

    this.scale = scale;
    this.radius = 112 * this.scale;
    this.checkRadius = 128 * this.scale;
    this.mass = MISSILE_WEIGHT;

    this.exist = true;
    this.dying = false;
    this.deathTimer = 0.0;
    this.angle = Math.atan2(y, x);

    this.perimeter = Math.PI * this.radius * 2;
    this.eindex = -1;
    
    this.arrowID = 3;

    this.gasTimer = 0.0;
}


// Handle gas generation
Missile.prototype.gen_gas = function(tm) {

    const GAS_DIST = 144;
    const ANGLE_PLUS = Math.PI / 8.0;

    this.gasTimer += 1.0 * tm;
    if(this.gasTimer >= MISSILE_GAS_WAIT) {

        let x = this.pos.x + Math.cos(this.angle + ANGLE_PLUS) * GAS_DIST;
        let y = this.pos.y + Math.sin(this.angle + ANGLE_PLUS) * GAS_DIST;

        // Create gas
        objman.add_gas(x, y, 1.5, 1.0);

        this.gasTimer -= MISSILE_GAS_WAIT;
    }
}


// Move Missile
Missile.prototype.move = function(tm) {

    // Check if outside the screen
    if( (this.speed.x > 0 && this.pos.x-this.checkRadius > AREA_WIDTH/2)
     || (this.speed.x < 0 && this.pos.x+this.checkRadius < -AREA_WIDTH/2)
     || (this.speed.y > 0 && this.pos.y-this.checkRadius > AREA_HEIGHT/2)
     || (this.speed.y < 0 && this.pos.y+this.checkRadius < -AREA_HEIGHT/2)) {

        this.dying = false;
        this.exist = false;
    }

    // Set angle
    this.angle = Math.PI + Math.atan2(this.speed.y, this.speed.x);

    let plAngle = Math.atan2(this.pos.y-objman.player.pos.y,
        this.pos.x - objman.player.pos.x);

    // Set target
    this.target.x = -Math.cos(plAngle) * MISSILE_TARGET;
    this.target.y = -Math.sin(plAngle) * MISSILE_TARGET;

    // Update speed
    if(this.speed.x < this.target.x) {

        this.speed.x += MISSILE_ACC * tm;
        if(this.speed.x > this.target.x)
            this.speed.x = this.target.x;
    }
    else if(this.speed.x > this.target.x) {

        this.speed.x -= MISSILE_ACC * tm;
        if(this.speed.x < this.target.x)
            this.speed.x = this.target.x;
    }

    if(this.speed.y < this.target.y) {

        this.speed.y += MISSILE_ACC * tm;
        if(this.speed.y > this.target.y)
            this.speed.y = this.target.y;
    }
    else if(this.speed.y > this.target.y) {

        this.speed.y -= MISSILE_ACC * tm;
        if(this.speed.y < this.target.y)
            this.speed.y = this.target.y;
    }

    // Move
    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;
}


// Update Missile
Missile.prototype.update = function(tm) {

    if(!this.exist) {

        // If dying, die until not dying any longer (ehheh)
        if(this.dying) {

            this.deathTimer -= 1.0 * tm;
            if(this.deathTimer <= 0.0)
                this.dying = false;
        }
        return;
    }

    // Check if in the screen
    let r = 128 * this.scale;
    let x = this.pos.x;
    let y = this.pos.y;
    this.offscreen = (x+r < cam.left || x-r > cam.left + cam.w 
        || y+r < cam.top || y-r > cam.top + cam.h);

    // Move
    this.move(tm);

    // Calculate total speed
    this.calculate_total_speed();

    // Generate gas
    if(!this.offscreen) {

        this.gen_gas(tm);
    }
}


// Draw Missile
Missile.prototype.draw = function() {

    let s = this.scale;
    let bitmap = assets.bitmaps.missile;
    
    if(!this.exist) {

        if(this.dying) {

            let t = this.deathTimer / MISSILE_DEATH_MAX;
            graph.set_color(1,1,1, t);
            s += (1-t) * 0.5;
        }
        else {

            return;
        }
    }
    else if(this.offscreen) {

        return;
    }

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.rotate(this.angle);
    tr.scale(s, s);
    tr.use_transform();

    graph.draw_bitmap_region(bitmap,
        0,0,256,256,-128, -128, 0);

    tr.pop();

    if(this.dying) {

        graph.set_color(1,1,1,1);
    }
}


// Death comes
Missile.prototype.die = function() {

    this.exist = false;
    this.dying = true;
    this.deathTimer = MISSILE_DEATH_MAX;

    // Create an explosion
    objman.add_explosion(this.pos.x, this.pos.y, 2.0, MISSILE_EXP_RADIUS, false);
}


// Missile-explosion collision
Missile.prototype.exp_collision = function(e, tm) {

    if(this.get_exp_collision(e, tm)) {

        // Die
        this.die();
    }
}


// Handle Missile-heart collision
Missile.prototype.heart_collision = function(o) {

    if(this.object_collision(o)) {
        
        this.die();
    }
}


// Player collision
Missile.prototype.player_collision = function(o) {

    if(this.object_collision(o)) {

        this.die();
    }
}

