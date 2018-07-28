// Collision object
// (c) 2018 Jani Nykänen

// Constructor
var CollisionObject = function() {

    this.scale = 1.0;
    this.radius = 1.0;
    this.pos = {x: 0, y: 0};
    this.speed = {x: 0, y: 0};
    this.static = false;
    this.exist = false;
    this.dying = false;
    this.deathTimer = 0.0;
    this.mass = 1.0;
    this.totalSpeed = 0.0;
    this.eindex = -1;
}


// Calculate total speed
CollisionObject.prototype.calculate_total_speed = function() {

    this.totalSpeed = Math.hypot(this.speed.x, this.speed.y);
}


// Object collision
CollisionObject.prototype.object_collision = function(o) {

    const DELTA = 0.01;
    const POW_LIMIT = 2.0;
    const POW_MIN = 1.5;
    const POW_MOD = 8;

    if(o.exist == false || this.exist == false 
      || (o.static && this.static) ) return;

    let dist = Math.hypot(o.pos.x - this.pos.x, o.pos.y- this.pos.y);
    let d = this.radius + o.radius;


    if(dist < d) {

        let angle = Math.atan2(this.pos.y - o.pos.y, this.pos.x - o.pos.x);
        let massRatio = o.mass / this.mass;
        let speedAverage = (this.totalSpeed + o.totalSpeed) / 2;

        if(o.static) {

            this.pos.x = o.pos.x + Math.cos(angle) * d;
            this.pos.y = o.pos.y + Math.sin(angle) * d;

            this.speed.x = Math.cos(angle) * this.totalSpeed * massRatio;
            this.speed.y = Math.sin(angle) * this.totalSpeed * massRatio;

            // TODO: Put these to an external place
            if(o.isHeart) {

                if(this.isAnimal) {

                    this.die(true);
                    this.divide(angle, -1);

                    o.hurt();
                }
                else {

                    this.isLeeching = true;
                }
            }
        }
        else {

            o.pos.x = this.pos.x - Math.cos(angle) * d;
            o.pos.y = this.pos.y - Math.sin(angle) * d;

            if(massRatio > DELTA) {

                o.speed.x = Math.cos(angle) * -speedAverage / massRatio;
                o.speed.y = Math.sin(angle) * -speedAverage / massRatio;
            }

            this.speed.x = Math.cos(angle) * speedAverage * massRatio;
            this.speed.y = Math.sin(angle) * speedAverage * massRatio;
        }

        
        // Create pow
        if( (this.isAnimal && o.isHeart) || speedAverage >= POW_LIMIT) {

            let size = POW_MIN + (speedAverage-POW_LIMIT) / POW_MOD;
            if(this.isAnimal && o.isHeart)  {

                size = POW_MIN + this.scale / 2.0;
            }

            // let x = 
            let x = this.pos.x - Math.cos(angle) * this.radius;
            let y = this.pos.y - Math.sin(angle) * this.radius;

            objman.add_pow(x, y, 2, size);
        }
    }
}


// Interaction with a magnet
CollisionObject.prototype.magnet_interaction = function(src, tm) {

    if(!this.exist || !src.magnetic) return;

    let dist = Math.hypot(src.pos.x - this.pos.x, src.pos.y - this.pos.y);
    if(dist < src.magnetDist) {

        let d = 1.0 - dist / src.magnetDist;
        let pull = src.magnetPower * d / this.mass;

        let angle = Math.atan2(src.pos.y - this.pos.y, src.pos.x - this.pos.x);

        this.speed.x += Math.cos(angle) * pull *tm;
        this.speed.y += Math.sin(angle) * pull *tm; 
    }
}


// Draw an arrow (if offscreen)
CollisionObject.prototype.draw_arrow = function() {

    const DIST_MOD = 1280;
    const ALPHA_BASE = 0.7;

    if(!this.exist || !this.offscreen) return;

    let angle = Math.atan2(cam.y - this.pos.y, cam.x - this.pos.x);
    let dist = Math.hypot(cam.x-this.pos.x, cam.y-this.pos.y);
    let scale = 1.25 - 0.5 * (dist / DIST_MOD);
    let radius = 64 * scale;
    let alpha = ALPHA_BASE - 0.1 * (dist / DIST_MOD);

    // Project sphere to a box
    let sx = Math.cos(angle);
    let sy = Math.sin(angle);

    let m = 1.0 / Math.max(Math.abs(sx), Math.abs(sy) );
    let cx = -m * sx;
    let cy = -m * sy;

    // Project the result to the game screen dimensions
    cx += 1.0;
    cy += 1.0;
    cx /= 2;
    cy /= 2;
    let scx = tr.viewport.w * cx;
    let scy = tr.viewport.h * cy;

    // Make sure the whole arrows is drawn
    if(scx - radius < 0)
        scx = radius;
    else if(scx + radius > tr.viewport.w)
        scx = tr.viewport.w - radius;
    if(scy - radius < 0)
        scy = radius;
    else if(scy + radius > tr.viewport.h)
        scy = tr.viewport.h - radius;

    graph.set_color(1,1,1, alpha);

    // Draw the arrow
    tr.push();
    tr.translate(scx, scy);
    tr.rotate(angle - Math.PI/2);
    tr.scale(scale, scale);
    tr.use_transform();

    graph.draw_bitmap_region(assets.bitmaps.arrow,
        this.arrowID*128,0,128,128, 
        -64, -64, 0);

    tr.pop();
}

