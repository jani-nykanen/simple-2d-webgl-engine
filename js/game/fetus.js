// Fetus
// (c) 2018 Jani Nykänen

// Constants
const MAGNET_DELTA = 0.01;
const FETUS_MAGNET_DIST = 1024.0;
const FETUS_MAGNET_POWER = 0.75;
const FETUS_DEAD_MAX = 240.0;


// Fetus constructor
var Fetus = function(x, y, follow, dist, scale) {

    CollisionObject.call(this);

    this.pos = {};
    this.pos.x = x;
    this.pos.y = y;
    this.fo = follow;
    this.minDist = dist;
    this.scale = scale;
    this.speed.x = 0;
    this.speed.y = 0;
    this.angle = 0.0;
    this.mass = 1.0;

    this.radius = 64*this.scale;
    this.static = false;
    this.exist = true;
    this.dying = false;

    this.magnetic = false;
    this.magnetTimer = 0.0;
    this.magnetDist = FETUS_MAGNET_DIST;
    this.magnetPower = FETUS_MAGNET_POWER;

    this.dead = false;
    this.deadTimer = 0.0;
}
Fetus.prototype = Object.create(CollisionObject.prototype);


// Update magnet
Fetus.prototype.update_magnet = function(tm) {

    const MAGNET_SPEED = 0.1;

    let oldState = this.magnetic;
    this.magnetic = kconf.fire1.state == state.DOWN && !this.dead;

    if(!this.magnetic) {

        if(this.magnetTimer < MAGNET_DELTA) {

            return;
        }
    }

    this.magnetTimer += MAGNET_SPEED * tm;
    if(this.magnetTimer >= Math.PI) {

        if(!this.magnetic)
            this.magnetTimer = 0.0;

        else
            this.magnetTimer -= Math.PI;
    }
}


// Update dead state
Fetus.prototype.update_death = function(tm) {

    this.deadTimer -= 1.0 * tm;
    if(this.deadTimer <= 0.0) {

        this.deadTimer = 0.0;
        this.dead = false;
    }
}


// Update
Fetus.prototype.update = function(tm) {

    const SPEED_MOD = 2;
    const EXP_RADIUS = 2.0;

    // Check distance to the follow target object
    var d = Math.hypot(this.pos.x-this.fo.pos.x, 
        this.pos.y-this.fo.pos.y);

    this.speed.x = 0.0;
    this.speed.y = 0.0;
    if(d > this.minDist) {

        this.angle = Math.atan2(this.fo.pos.y-this.pos.y, 
            this.fo.pos.x-this.pos.x);

        let s = (d-this.minDist) / SPEED_MOD;

        this.speed.x = Math.cos(this.angle) * s;
        this.speed.y = Math.sin(this.angle) * s;
    }

    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

    // Update magnet
    this.update_magnet(tm);

    // Explosion
    if(!this.dead && kconf.fire2.state == state.PRESSED) {

        objman.add_explosion(this.pos.x, this.pos.y, 2.0, EXP_RADIUS);
        this.dead = true;
        this.deadTimer = FETUS_DEAD_MAX;
    }

    // Update dead state
    if(this.dead) {

        this.update_death(tm);
    }

}


// Draw magnetic radiation
Fetus.prototype.draw_radiation = function() {

    let t = 1.0 - this.magnetTimer / Math.PI;
    let s = this.scale * (1 + 4*t);

    graph.set_color(0.95,0.95,1,1 - t);
    graph.draw_scaled_bitmap_region(
        assets.bitmaps.fetus,
        0,128,128, 128,
        - 64*s, - 64*s,
        128*s, 128*s,
        0
    );
}


// Draw
Fetus.prototype.draw = function() {

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.rotate(this.angle - Math.PI);
    tr.use_transform();

    
     // Draw magnet, if magnetic
     if(this.magnetic || this.magnetTimer > MAGNET_DELTA) {

        // Draw radiation to the background
        this.draw_radiation();

        let t = Math.abs(Math.sin(this.magnetTimer))

        graph.set_color(1+t,1+t,1+t, 1);
        let s = (1.0+t*0.5) * this.scale;

        graph.draw_scaled_bitmap_region(
            assets.bitmaps.fetus,
            0,0,128, 128,
            - 64*s, - 64*s,
            128*s, 128*s,
            0
        );

        graph.set_color(1, 1, 1, 1);
    }
    else {

        // Draw base
        graph.draw_scaled_bitmap_region(
            assets.bitmaps.fetus,
            0,this.dead ? 256 : 0,128, 128,
            - 64*this.scale, - 64*this.scale,
            128*this.scale, 128*this.scale,
            0
        );

        // Draw "appearing" fetus
        if(this.dead && this.deadTimer < 30.0) {

            let t = 1.0 - this.deadTimer / 30.0;
            graph.set_color(1, 1, 1, t);

            graph.draw_scaled_bitmap_region(
                assets.bitmaps.fetus,
                0,0,128, 128,
                - 64*this.scale, - 64*this.scale,
                128*this.scale, 128*this.scale,
                0
            );

            graph.set_color(1, 1, 1, 1);
        }

    }

    tr.pop();
}
