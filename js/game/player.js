// Player object
// (c) 2018 Jani Nykänen

// Constants
const PL_ROTATE_SPEED = 0.075;
const PL_FORWARD_TARGET = 16.0;
const PL_REVERSE_TARGET = 8.0;
const PL_ACCELERATION = 0.5;

// Constructor
var Player = function(x, y) {

    this.pos = {
        x: x,
        y: y,
    }

    this.speed = {
        x: 0,
        y: 0
    }
    this.target = {
        x: 0,
        y: 0,
    }

    this.angle = 0.0
    this.totalSpeed = 0.0;
}


// Control player
Player.prototype.control = function(tm) {

    // Turn left/right
    var dir = 0.0;
    if(kconf.right.state == state.DOWN) 
        dir = -1.0;
    else if(kconf.left.state == state.DOWN) 
        dir = 1.0;

    this.angle += PL_ROTATE_SPEED * dir * tm;
    
    // Move back/forward
    dir = 0.0;
    var max = 0;
    if(kconf.up.state == state.DOWN) {

        max = PL_FORWARD_TARGET
        dir = -1.0;
    }
    else if(kconf.down.state == state.DOWN) {
        
        max = PL_REVERSE_TARGET;
        dir = 1.0;
    }

    this.target.x = Math.sin(this.angle) * max * dir;
    this.target.y = Math.cos(this.angle) * max * dir;
        
}


// Move axis
Player.prototype.move_axis = function(o,target, speed, tm) {

    if(target > o.coord) {

        o.coord += speed * tm;
        if(o.coord >= target) {

            o.coord = target;
        }
    }
    else if(target < o.coord) {

        o.coord -= speed * tm;
        if(o.coord  <= target) {

            o.coord = target;
        }
    }

    o.pos += o.coord * tm;
}


// Move
Player.prototype.move = function(tm) {

    var ox = {pos: this.pos.x, coord: this.speed.x};
    var oy = {pos: this.pos.y, coord: this.speed.y};

    this.move_axis(ox, this.target.x, PL_ACCELERATION, tm);
    this.move_axis(oy, this.target.y, PL_ACCELERATION, tm);

    this.pos.x = ox.pos;
    this.speed.x = ox.coord;

    this.pos.y = oy.pos;
    this.speed.y = oy.coord;

    this.totalSpeed = Math.hypot(this.speed.x, this.speed.y);

}


// Move camera
Player.prototype.move_cam = function(tm) {

    const SCALE_MOD = 32.0;
    const DIST_MOD_MIN = 128.0;

    var dmod = DIST_MOD_MIN + this.totalSpeed * 4.0;

    var dx = this.pos.x + Math.cos(-this.angle - Math.PI / 2.0) * dmod;
    var dy = this.pos.y + Math.sin(-this.angle - Math.PI / 2.0) * dmod;

    var angle = Math.atan2(dy - cam.y,dx - cam.x);
    var dist = Math.hypot(dx-cam.x, dy-cam.y);

    cam.x += Math.cos(angle) * (dist/12.0) * tm;
    cam.y += Math.sin(angle) * (dist/8.0) * tm;
/*
    cam.sx = 1.0 / (1.0 + this.totalSpeed / SCALE_MOD);
    cam.sy = cam.sx;
    */
}


// Update player
Player.prototype.update = function(tm) {

    this.control(tm);
    this.move(tm);
    this.move_cam(tm);
}


// Draw player
Player.prototype.draw = function() {

    var bmp = assets.bitmaps.player;

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.rotate(-this.angle);
    tr.use_transform();
    
    graph.draw_bitmap(bmp, -bmp.width/2, -bmp.height/2, 0);

    tr.pop();
}
