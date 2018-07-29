// Player object
// (c) 2018 Jani Nykänen

// Constants
const PL_ROTATE_SPEED = 0.0625;
const PL_FORWARD_TARGET = 14.0;
const PL_REVERSE_TARGET = 8.0;
const PL_ACCELERATION = 0.40;
const PL_SIZE_SCALE = 0.85;
const PL_GAS_WAIT = 8.0;
const PL_RADIUS = 96;
const PL_MASS = 1.25;
const PL_BUTT_DIST = 24;
const PL_GAS_DIST = 72;


// Constructor
var Player = function(x, y) {

    CollisionObject.call(this);

    this.pos.x = x;
    this.pos.y = y;

    this.target = {x: 0, y: 0};

    this.angle = 0.0
    this.totalSpeed = 0.0;
    this.totalTarget = 0.0;

    this.gasTimer = 0;

    this.radius = PL_RADIUS;
    this.mass = PL_MASS;
    this.exist = true;
    this.eindex = -1;

    this.butt = {
        pos: {x: 0, y: 0}
    };
}
Player.prototype = Object.create(CollisionObject.prototype);


// Handle gas creation
Player.prototype.create_gas = function(tm) {

    const DELTA = 0.1;
    if(this.totalTarget < DELTA)
        return;

    this.gasTimer += 1.0 * tm;
    if(this.gasTimer >= PL_GAS_WAIT) {

        let x = this.pos.x + Math.cos(-this.angle + Math.PI / 2) * PL_GAS_DIST;
        let y = this.pos.y + Math.sin(-this.angle + Math.PI / 2) * PL_GAS_DIST;

        // Create gas
        objman.add_gas(x, y, 1.5, 1.0);

        this.gasTimer -= PL_GAS_WAIT;
    }
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

    const SLOW_MODIF = 0.80;

    var accl = PL_ACCELERATION - (PL_ACCELERATION*SLOW_MODIF) *
        Math.min(1.0, Math.pow(this.totalSpeed / PL_FORWARD_TARGET, 2));

    var ox = {pos: this.pos.x, coord: this.speed.x};
    var oy = {pos: this.pos.y, coord: this.speed.y};

    this.move_axis(ox, this.target.x, accl, tm);
    this.move_axis(oy, this.target.y, accl, tm);

    this.pos.x = ox.pos;
    this.speed.x = ox.coord;

    this.pos.y = oy.pos;
    this.speed.y = oy.coord;

    this.totalSpeed = Math.hypot(this.speed.x, this.speed.y);
    this.totalTarget = Math.hypot(this.target.x, this.target.y);

    this.butt.pos.x = this.pos.x + Math.cos(-this.angle + Math.PI / 2) * PL_BUTT_DIST;
    this.butt.pos.y = this.pos.y + Math.sin(-this.angle + Math.PI / 2) * PL_BUTT_DIST;
}


// Move camera
Player.prototype.move_cam = function(tm) {

    const SCALE_SPEED = 0.00275;
    const DIST_MOD_MIN = 128.0;
    const CAM_SPEED_DEFAULT = 12;
    const CAM_SPEED_FETUS = 24;
    const DELTA = 1.0;

    // Move
    var dmod = DIST_MOD_MIN + this.totalSpeed * 4.0;

    var camSpeed, dx, dy;

    if(kconf.fire1.state == state.DOWN) {

        dx = this.pos.x;
        dy = this.pos.y;
        camSpeed = CAM_SPEED_FETUS;
    }
    else {

        let cdir = kconf.down.state == state.DOWN ? - 1 : 1;

        dx = this.pos.x + cdir*Math.cos(-this.angle - Math.PI / 2.0) * dmod;
        dy = this.pos.y + cdir*Math.sin(-this.angle - Math.PI / 2.0) * dmod;
        camSpeed = CAM_SPEED_DEFAULT;
    }

    var angle = Math.atan2(dy - cam.y,dx - cam.x);
    var dist = Math.hypot(dx-cam.x, dy-cam.y);

    cam.x += Math.cos(angle) * (dist/camSpeed) * tm;
    cam.y += Math.sin(angle) * (dist/ (camSpeed / tr.viewport.ratio)) * tm;

    // Scale
    var scaleTarget = 0.90 - 0.20 * (this.totalTarget / PL_FORWARD_TARGET);
    
    if(cam.sx > scaleTarget) {

        cam.sx -= SCALE_SPEED * tm;
        if(cam.sx < scaleTarget)
            cam.sx = scaleTarget;
    }
    else if(cam.sx < scaleTarget && this.totalSpeed <= DELTA
     && !(kconf.fire1.state == state.DOWN || kconf.fire2.state == state.DOWN)) {

        cam.sx += SCALE_SPEED * tm;
        if(cam.sx > scaleTarget)
            cam.sx = scaleTarget;
    }
    cam.sy = cam.sx;
}


// Update player
Player.prototype.update = function(tm) {

    this.create_gas(tm);
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
    
    graph.draw_scaled_bitmap(bmp, 
         -bmp.width/2 * PL_SIZE_SCALE,
         -bmp.height/2 * PL_SIZE_SCALE
         ,PL_SIZE_SCALE,PL_SIZE_SCALE, 0);
         
    tr.pop();
}


// Horizontal wall collision
Player.prototype.horizontal_wall_collision = function(y, dir) {

    if(dir == -1 && this.pos.y < y + this.radius) {

        this.pos.y = y + this.radius;
        this.speed.y /= -this.mass;
    }
    else if(dir == 1 && this.pos.y > y - this.radius) {

        this.pos.y = y - this.radius;
        this.speed.y /= -this.mass;
    }
}


// Vertical wall collision
Player.prototype.vertical_wall_collision = function(x, dir) {

    if(dir == -1 && this.pos.x < x + this.radius) {

        this.pos.x = x + this.radius;
        this.speed.x /= -this.mass;
    }
    else if(dir == 1 && this.pos.x > x - this.radius) {

        this.pos.x = x - this.radius;
        this.speed.x /= -this.mass;
    }
}


// Wall collisions
Player.prototype.wall_collisions = function(w, h) {

    this.horizontal_wall_collision(-h/2, -1);
    this.horizontal_wall_collision(h/2, 1);
    this.vertical_wall_collision(-w/2, -1);
    this.vertical_wall_collision(w/2, 1);
}


// Player-explosion collision
Player.prototype.exp_collision = function(e) {

    const EXP_SPEED = 3.0;

    if(!e.exist || e.eindex == this.eindex) return;

    let dist = Math.hypot(e.pos.x - this.pos.x, e.pos.y - this.pos.y);

    if(dist < (e.radius*0.90) + this.radius) {

        this.eindex = e.eindex;

        let angle = Math.atan2(e.pos.y - this.pos.y, 
            e.pos.x - this.pos.x);

        this.speed.x -= Math.cos(angle) * EXP_SPEED * e.targetScale;
        this.speed.y -= Math.sin(angle) * EXP_SPEED * e.targetScale;
    }
}
