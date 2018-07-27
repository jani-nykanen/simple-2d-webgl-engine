// Animal
// (c) 2018 Jani Nykänen

// Constants
const ANIMAL_DEATH_MAX = 30.0;
const ANIMAL_NORMAL = 0;
const ANIMAL_MONSTER = 1;

const MONSTER_ACC = 0.25;
const MONSTER_WAVE_SPEED = 0.05;
const MONSTER_AMPLITUDE = 0.25;


// Animal constructor
var Animal = function() {

    CollisionObject.call(this);

    this.radius = 1;
    this.rotSpeed = 0;
    this.offscreen = false;

    this.isAnimal = true;
}
Animal.prototype = Object.create(CollisionObject.prototype);


// Create the animal
Animal.prototype.create_self = function(x, y, sx, sy, scale, type) {

    this.pos.x = x;
    this.pos.y = y;
    
    this.speed.x = sx;
    this.speed.y = sy;

    if(type == ANIMAL_MONSTER) {

        this.target = {x: 0, y: 0};
        this.speedTarget = Math.hypot(sx, sy);
        this.wave = 0.0;
    }

    this.scale = scale;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = 112 * this.scale;
    this.checkRadius = 128 * this.scale;
    this.mass = ([this.scale, 0.75]) [type];

    this.exist = true;
    this.dying = false;
    this.deathTimer = 0.0;

    this.perimeter = Math.PI * this.radius * 2;
    var speed = Math.hypot(sx, sy);

    this.rotSpeed = speed / this.perimeter * 2 * Math.PI;

    this.eindex = -1;

    this.type = type;
}


// Update type specific behavior
Animal.prototype.update_special = function(tm) {

    switch(this.type) {

    // Normal animal
    case ANIMAL_NORMAL:
        // Rotate
        var dir = this.speed.x < 0.0 ? -1 : 1;
        this.rotSpeed = Math.hypot(this.speed.x, this.speed.y) / this.perimeter * 2 * Math.PI;
        this.angle += this.rotSpeed * dir * tm;

        break;
    
    // Monster
    case ANIMAL_MONSTER:
        
        // Get target
        this.angle = Math.atan2(this.pos.y, this.pos.x);
        this.target.x = -Math.cos(this.angle) * this.speedTarget;
        this.target.y = -Math.sin(this.angle) * this.speedTarget;

        // Update wave
        this.wave += MONSTER_WAVE_SPEED * tm;
        this.scale = (2.0-MONSTER_AMPLITUDE) + Math.sin(this.wave) * MONSTER_AMPLITUDE;
        this.radius = 112 * this.scale;

        // Update speed
        if(this.speed.x < this.target.x) {

            this.speed.x += MONSTER_ACC * tm;
            if(this.speed.x > this.target.x)
                this.speed.x = this.target.x;
        }
        else if(this.speed.x > this.target.x) {

            this.speed.x -= MONSTER_ACC * tm;
            if(this.speed.x < this.target.x)
                this.speed.x = this.target.x;
        }

        if(this.speed.y < this.target.y) {

            this.speed.y += MONSTER_ACC * tm;
            if(this.speed.y > this.target.y)
                this.speed.y = this.target.y;
        }
        else if(this.speed.y > this.target.y) {

            this.speed.y -= MONSTER_ACC * tm;
            if(this.speed.y < this.target.y)
                this.speed.y = this.target.y;
        }

        break;

    default:
        break;

    }
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

    // Update special
    this.update_special(tm);
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
    let bitmap = ([assets.bitmaps.animal, assets.bitmaps.monster]) [this.type];
    
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

    graph.draw_bitmap_region(bitmap,
        0,0,256,256,-128, -128, 0);

    tr.pop();

    if(this.dying) {

        graph.set_color(1,1,1,1);
    }
}


// Death comes
Animal.prototype.die = function(hurtHeart) {

    const MIN_DMG = 0.05;
    const DMG_MOD = 0.02;

    this.exist = false;
    this.dying = true;
    this.deathTimer = ANIMAL_DEATH_MAX;

    // Reduce health
    if(hurtHeart) {

        let t = MIN_DMG + this.mass * DMG_MOD;
        _status.reduce_health(t);
    }
}


// Divide to two smaller animals, if big enough
Animal.prototype.divide = function(angle, eindex) {

    if(this.type != ANIMAL_NORMAL || this.scale < 1.5) return;

    let scale = this.scale / 2;
    let rad = this.radius / 2;
    let x,y;

    let anglePlus = -Math.PI / 4;

    for(var a = 0; a < 2; ++ a) {

        anglePlus = a == 0 ? anglePlus : -anglePlus;

        x = this.pos.x + Math.cos(Math.PI/2 + angle + a*Math.PI + anglePlus) * rad;
        y = this.pos.y + Math.sin(Math.PI/2 + angle + a*Math.PI + anglePlus) * rad;

        objman.add_animal(x, y, -Math.PI + angle + a*Math.PI, Math.max(this.totalSpeed * 0.90, 2), scale,eindex);
    }
}


// Animal-explosion collision
Animal.prototype.exp_collision = function(e) {

    if(!e.exist || !this.exist || e.eindex == this.eindex) return;

    let dist = Math.hypot(e.pos.x - this.pos.x, e.pos.y - this.pos.y);

    if(dist < e.radius + this.radius) {

        this.die();
        let angle = Math.atan2(e.pos.y - this.pos.y, 
            e.pos.x - this.pos.x);

        this.divide(angle, e.eindex);
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
