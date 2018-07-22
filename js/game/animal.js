// Animal
// (c) 2018 Jani Nykänen

// TODO: Inherit from "CollisionObject"
// TODO: Add "CollisionObject"

const ANIMAL_DEATH_MAX = 60.0;

// Animal constructor
var Animal = function() {

    this.pos = {x: 0, y: 0};
    this.speed = {x: 0, y: 0};
    this.scale = 1.0;
    this.angle = 0.0;
    this.radius = 1;
    this.rotSpeed = 0;

    this.exist = false;
    this.dying = false;
    this.deathTimer = 0.0;
   
}


// Create the animal
Animal.prototype.create_self = function(x, y, sx, sy, scale) {

    this.pos.x = x;
    this.pos.y = y;
    
    this.speed.x = sx;
    this.speed.y = sy;

    this.scale = scale;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = 128 * this.scale;

    this.exist = true;
    this.dying = false;
    this.deathTimer = 0.0;

    var perimeter = Math.PI * this.radius * 2;
    var speed = Math.hypot(sx, sy);

    this.rotSpeed = speed / perimeter * 2 * Math.PI;
}


// Move animal
Animal.prototype.move = function(tm) {

    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

    // Check if outside the screen
    if( (this.speed.x > 0 && this.pos.x-this.radius > AREA_WIDTH/2)
     || (this.speed.x < 0 && this.pos.x+this.radius < -AREA_WIDTH/2)
     || (this.speed.y > 0 && this.pos.y-this.radius > AREA_HEIGHT/2)
     || (this.speed.y < 0 && this.pos.y+this.radius < -AREA_HEIGHT/2)) {

        this.dying = false;
        this.exist = false;
    }

    // Rotate
    var dir = this.speed.x < 0.0 ? -1 : 1;
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
}


// Draw animal
Animal.prototype.draw = function() {

    if(!this.exist) {

        if(this.dying) {

            // ...
        }
        return;
    }

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.rotate(this.angle);
    tr.scale(this.scale, this.scale);
    tr.use_transform();

    graph.draw_bitmap(assets.bitmaps.animal, -128, -128, 0);

    tr.pop();
}
