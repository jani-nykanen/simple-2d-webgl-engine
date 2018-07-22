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

}


// Move animal
Animal.prototype.move = function(tm) {

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;

    // Check if outside the screen
    if( (this.speed.x > 0 && this.pos.x-this.radius > AREA_WIDTH/2)
     || (this.speed.x < 0 && this.pos.x+this.radius < -AREA_WIDTH/2)
     || (this.speed.y > 0 && this.pos.y-this.radius > AREA_HEIGHT/2)
     || (this.speed.y < 0 && this.pos.y+this.radius < -AREA_HEIGHT/2)) {

        this.dying = false;
        this.exist = false;
    }
    
}


// Update animal
Animal.prototype.update = function(tm) {

    if(!this.exist) {
        
        // If dying, die until not dying any longer (ehheh)
        if(this.dying) {

            this.deathTimer -= 1.0 * tm;
            if(this.deathTimer < 0.0)
                this.dying = false;
        }
        return;
    }
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

    graph.draw_bitmap(assets.bitmaps.animal, 0, 0, 0);

    tr.pop();
}
