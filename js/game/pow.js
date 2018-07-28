// Pow
// (c) 2018 Jani Nykänen

// Constants
const POW_TIMER_MAX = 60.0;


// Constructor
var Pow = function() {

    this.pos = {x: 0, y: 0};
    this.timer = 0.0;
    this.speed = 1.0;
    this.scale = 1.0;
    this.scaleSpeed = 0.0;
    this.exist = false;
}


// Create me
Pow.prototype.create_self = function(x, y, speed, scale) {

    this.pos.x = x;
    this.pos.y = y;
    this.speed = speed;
    this.timer = 0.0;
    this.scale = scale / 2;
    this.scaleSpeed = speed / POW_TIMER_MAX * scale;

    this.exist = true;

}


// Update
Pow.prototype.update = function(tm) {

    if(!this.exist) return 

    this.timer += this.speed * tm;
    this.scale += this.scaleSpeed * tm;
    if(this.timer >= POW_TIMER_MAX) {
            
        this.exist = false;
        return;
    }
}


// Draw
Pow.prototype.draw = function() {

    if(!this.exist) return;

    let t = this.scale;
    let alpha = 1.0 - this.timer / POW_TIMER_MAX;
    graph.set_color(1,1,1, alpha);

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.use_transform();
    
    graph.draw_scaled_bitmap(assets.bitmaps.pow,
        -64 * t, -64 * t, t, t, 0);

    tr.pop();
    graph.set_color(1,1,1,1);
}
