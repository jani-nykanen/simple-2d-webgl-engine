// Collision object
// (c) 2018 Jani Nykänen

// Constructor
var CollisionObject = function() {

    this.scale = 1.0;
    this.radius = 1.0;
    this.pos = {x: 0, y: 0};
    this.speed = {x: 0, y: 0};
    this.static = false;
    this.exist = false;
    this.dying = false;
    this.deathTimer = 0.0;
    this.mass = 1.0;
    this.totalSpeed = 0.0;
}


// Calculate total speed
CollisionObject.prototype.calculate_total_speed = function() {

    this.totalSpeed = Math.hypot(this.speed.x, this.speed.y);
}


// Object collision
CollisionObject.prototype.object_collision = function(o) {

    const DELTA = 0.01;

    if(o.exist == false || this.exist == false) return;

    let dist = Math.hypot(o.pos.x - this.pos.x, o.pos.y- this.pos.y);
    let d = this.radius + o.radius;

    if(dist < d) {

        let angle = Math.atan2(this.pos.y - o.pos.y, this.pos.x - o.pos.x);
        let massRatio = o.mass / this.mass;

        if(this.static) {

            o.pos.x = this.pos.x - Math.cos(angle) * d;
            o.pos.y = this.pos.y - Math.sin(angle) * d;

            if(massRatio > DELTA) {

                o.speed.x = Math.cos(angle) * -o.totalSpeed / massRatio;
                o.speed.y = Math.sin(angle) * -o.totalSpeed / massRatio;
            }
        }
        else {

            let speedAverage = (this.totalSpeed + o.totalSpeed) / 2;

            o.pos.x = this.pos.x - Math.cos(angle) * d;
            o.pos.y = this.pos.y - Math.sin(angle) * d;

            if(massRatio > DELTA) {

                o.speed.x = Math.cos(angle) * -speedAverage / massRatio;
                o.speed.y = Math.sin(angle) * -speedAverage / massRatio;
            }

            this.speed.x = Math.cos(angle) * speedAverage * massRatio;
            this.speed.y = Math.sin(angle) * speedAverage * massRatio;
        }
    }
}


// Interaction with a magnet
CollisionObject.prototype.magnet_interaction = function(src, tm) {

    if(!this.exist || !src.magnetic) return;

    let dist = Math.hypot(src.pos.x - this.pos.x, src.pos.y - this.pos.y);
    if(dist < src.magnetDist) {

        let d = 1.0 - dist / src.magnetDist;
        let pull = src.magnetPower * d / this.mass;

        let angle = Math.atan2(src.pos.y - this.pos.y, src.pos.x - this.pos.x);

        this.speed.x += Math.cos(angle) * pull *tm;
        this.speed.y += Math.sin(angle) * pull *tm;
    }
}
