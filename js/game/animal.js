// Animal
// (c) 2018 Jani Nykänen

const ANIMAL_DEATH_MAX = 30.0;

// Animal constructor
var Animal = function() {

    CollisionObject.call(this);

    this.radius = 1;
    this.rotSpeed = 0;
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
