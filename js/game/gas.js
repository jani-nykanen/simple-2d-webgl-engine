// GAS!
// (c) 2018 Jani Nykänen

// Constants
const GAS_MAX = 60.0;

// Gas constructor
var Gas = function() {

    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.timer = 0;
    this.speed = 1.0;
    this.exist = false;
}


// Create some nice gas
Gas.prototype.create_instance = function(x, y, speed, scale) {

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.scale = scale || 1.0;
    this.exist = true;
    this.timer = 0.0;
}


// Update gas
Gas.prototype.update = function(tm) {

    if(!this.exist) return;

    this.timer += this.speed * tm;
    if(this.timer >= GAS_MAX)
        this.exist = false;
}


// Draw gas
Gas.prototype.draw = function() {

    if(!this.exist) return;

    tr.push();
    tr.translate(this.x, this.y);
    tr.scale(this.scale, this.scale);
    tr.use_transform();

    let frame = 0;
    if(this.timer < GAS_MAX / 2.0) {

         frame = Math.floor(this.timer / (GAS_MAX/2.0) * 6) ;
    }
    else {

        let alpha = 1.0 - (this.timer-GAS_MAX/2.0) / (GAS_MAX/2.0);
        frame = 5;
        graph.set_color(1,1,1, alpha);
    }

    graph.draw_bitmap_region(assets.bitmaps.gas, frame*128, 0,
        128, 128, -64, -64, 0);

    tr.pop();

    if(this.timer >= GAS_MAX / 2.0) {

        graph.set_color(1,1,1,1);
        graph.set_to_locked_color();
    }
}
