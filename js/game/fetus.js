// Fetus
// (c) 2018 Jani Nykänen

// Fetus constructor
var Fetus = function(x, y, follow, dist, scale) {

    this.pos = {};
    this.pos.x = x;
    this.pos.y = y;
    this.fo = follow;
    this.minDist = dist;
    this.scale = scale;
    this.speed = {x: 0, y: 0};
    this.angle = 0.0;
}


// Update
Fetus.prototype.update = function(tm) {

    const SPEED_MOD = 2;

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

}


// Draw
Fetus.prototype.draw = function() {

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.rotate(this.angle - Math.PI);
    tr.use_transform();

    graph.draw_scaled_bitmap_region(
        assets.bitmaps.fetus,
        0,0,128, 128,
        - 64*this.scale, - 64*this.scale,
        128*this.scale, 128*this.scale,
        0
    );

    tr.pop();
}
