// Animal
// (c) 2018 Jani Nykänen

const ANIMAL_DEATH_MAX = 30.0;

// Animal constructor
var Animal = function() {

    CollisionObject.call(this);

    this.radius = 1;
    this.rotSpeed = 0;
    this.offscreen = false;
}
Animal.prototype = Object.create(CollisionObject.prototype);


// Create the animal
Animal.prototype.create_self = function(x, y, sx, sy, scale) {

    this.pos.x = x;
    this.pos.y = y;
    
    this.speed.x = sx;
    this.speed.y = sy;

    this.scale = scale;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = 112 * this.scale;
    this.checkRadius = 128 * this.scale;
    this.mass = this.scale;

    this.exist = true;
    this.dying = false;
    this.deathTimer = 0.0;

    this.perimeter = Math.PI * this.radius * 2;
    var speed = Math.hypot(sx, sy);

    this.rotSpeed = speed / this.perimeter * 2 * Math.PI;
}


// Move animal
Animal.prototype.move = function(tm) {

    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

    // Check if outside the screen
    if( (this.speed.x > 0 && this.pos.x-this.checkRadius > AREA_WIDTH/2)
     || (this.speed.x < 0 && this.pos.x+this.checkRadius < -AREA_WIDTH/2)
     || (this.speed.y > 0 && this.pos.y-this.checkRadius > AREA_HEIGHT/2)
     || (this.speed.y < 0 && this.pos.y+this.checkRadius < -AREA_HEIGHT/2)) {

        this.dying = false;
        this.exist = false;
    }

    // Rotate
    var dir = this.speed.x < 0.0 ? -1 : 1;
    this.rotSpeed = Math.hypot(this.speed.x, this.speed.y) / this.perimeter * 2 * Math.PI;
    this.angle += this.rotSpeed * dir * tm;
    
}


// Update animal
Animal.prototype.update = function(tm) {

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
}


// Draw animal
Animal.prototype.draw = function() {

    let s = this.scale;

    if(!this.exist) {

        if(this.dying) {

            let t = this.deathTimer / ANIMAL_DEATH_MAX;
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

    graph.draw_bitmap(assets.bitmaps.animal, -128, -128, 0);

    tr.pop();

    if(this.dying) {

        graph.set_color(1,1,1,1);
    }
}


// Death comes
Animal.prototype.die = function() {

    this.exist = false;
    this.dying = true;
    this.deathTimer = ANIMAL_DEATH_MAX;
}


// Animal-explosion collision
Animal.prototype.exp_collision = function(e) {

    if(!e.exist || !this.exist) return;

    let dist = Math.hypot(e.pos.x - this.pos.x, e.pos.y - this.pos.y);

    if(dist < e.radius + this.radius) {

        this.die();
    }
}


// Draw an arrow (if offscreen)
Animal.prototype.draw_arrow = function() {

    const DIST_MOD = 1280;

    if(!this.exist || !this.offscreen) return;

    let angle = Math.atan2(cam.y - this.pos.y, cam.x - this.pos.x);
    let dist = Math.hypot(cam.x-this.pos.x, cam.y-this.pos.y);
    let scale = 1.25 - 0.5 * (dist / DIST_MOD);
    let radius = 64 * scale;
    let alpha = 0.6 - 0.1 * (dist / DIST_MOD);

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

    graph.draw_bitmap(assets.bitmaps.arrow, -64, -64, 0);

    tr.pop();
}
