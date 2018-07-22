// Chain
// (c) 2018 Jani Nykänen

const CHAIN_MAX_SPEED = 32.0; 

// Chain constructor
var Chain = function(x, y, follow, dist, scale) {

    this.pos = {};
    this.pos.x = x;
    this.pos.y = y;
    this.fo = follow;
    this.minDist = dist;
    this.scale = scale;
    this.speed = {x: 0, y: 0};
}


// Update
Chain.prototype.update = function(tm) {

    const SPEED_MOD = 2;

    // Check distance to the follow target object
    var d = Math.hypot(this.pos.x-this.fo.pos.x, 
        this.pos.y-this.fo.pos.y);

    if(d > this.minDist) {

        let angle = Math.atan2(this.fo.pos.y-this.pos.y, 
            this.fo.pos.x-this.pos.x);

        let s = (d-this.minDist) / SPEED_MOD;

        this.speed.x = Math.cos(angle) * s;
        this.speed.y = Math.sin(angle) * s;
    }

    if(Math.hypot(this.speed.x,this.speed.y) > FETUS_MAX_SPEED) {

        this.pos.x = this.fo.pos.x;
        this.pos.y = this.fo.pos.y;
        this.speed.x = 0.0;
        this.speed.y = 0.0;
    }

    this.pos.x += this.speed.x * tm;
    this.pos.y += this.speed.y * tm;

}


// Draw
Chain.prototype.draw = function() {

    graph.draw_scaled_bitmap_region(
        assets.bitmaps.fetus,
        128,0,64, 64,
        this.pos.x - 32*this.scale, this.pos.y - 32*this.scale,
        64*this.scale, 64*this.scale,
        0
    );
}
