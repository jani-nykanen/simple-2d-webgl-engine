// Animal
// (c) 2018 Jani Nykänen

// Constants
const ANIMAL_DEATH_MAX = 30.0;


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
Animal.prototype.create_self = function(x, y, sx, sy, scale, skeleton) {

    this.pos.x = x;
    this.pos.y = y;
    
    this.speed.x = sx;
    this.speed.y = sy;

    this.scale = scale;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = 112 * this.scale;
    this.checkRadius = 128 * this.scale;
    this.mass = skeleton ? MONSTER_WEIGHT : this.scale;

    this.exist = true;
    this.dying = false;
    this.deathTimer = 0.0;

    this.perimeter = Math.PI * this.radius * 2;
    var speed = Math.hypot(sx, sy);

    this.rotSpeed = speed / this.perimeter * 2 * Math.PI;

    this.eindex = -1;
    this.skeleton = skeleton;

    this.arrowID = skeleton ? 2 : 0;
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
    let bitmap = assets.bitmaps.animal;
    
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
        this.skeleton ? 256 : 0,0,256,256,-128, -128, 0);

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

    if(this.scale < 1.5 || this.skeleton) return;

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


// Handle animal-heart collision
Animal.prototype.heart_collision = function(o) {

    if(this.object_collision(o)) {

        let angle = Math.atan2(this.pos.y - o.pos.y, this.pos.x - o.pos.x);

        this.die(true);
        this.divide(angle, -1);

         o.hurt();
    }
}
