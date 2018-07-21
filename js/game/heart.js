// Heart
// (c) 2018 Jani Nykänen

// Constants
const HEART_BUMP_WAIT = 45.0;
const HEART_BUMP_LENGTH = 16.0;
const HEART_BASE_SCALE = 2.0;
const HEART_SCALE_MOD = 0.5;
const HEART_RADIUS = 172;


// Heart constructor
var Heart = function(x, y) {

    this.x = x;
    this.y = y;
    this.scale = HEART_BASE_SCALE;
    this.bumpTimer = 0.0;
    this.bumpState = 0.0;
    this.radius = HEART_RADIUS;
}


// Update heart
Heart.prototype.update = function(tm) {

    this.scale = 2;

    // Update bump timer
    this.bumpTimer += 1.0 * tm;
    if(this.bumpTimer >= HEART_BUMP_WAIT) {

        this.bumpState += 1.0 * tm;
        if(this.bumpState >= HEART_BUMP_LENGTH) {

            this.bumpState = 0.0;
            this.bumpTimer = 0.0;
        }

        let t = (1.0 - Math.abs(this.bumpState - HEART_BUMP_LENGTH / 2.0) / (HEART_BUMP_LENGTH / 2))
             * HEART_SCALE_MOD;
        this.scale = HEART_BASE_SCALE + t;
    }
}


// Draw heart
Heart.prototype.draw = function() {

    graph.draw_scaled_bitmap(
        assets.bitmaps.heart,
        this.x - assets.bitmaps.heart.width/2 * this.scale,
        this.y - assets.bitmaps.heart.height/2 * this.scale,
        this.scale,
        this.scale,0
    );
}


// Collision with the player
Heart.prototype.player_collision = function(pl) {

    let dist = Math.hypot(pl.pos.x - this.x, pl.pos.y- this.y);
    let d = this.radius + pl.radius;
    if(dist < d) {

        let angle = Math.atan2(this.y - pl.pos.y, this.x - pl.pos.x);
        pl.pos.x = this.x - Math.cos(angle) * d;
        pl.pos.y = this.y - Math.sin(angle) * d;

        pl.speed.x = Math.cos(angle) * -pl.totalSpeed / pl.mass;
        pl.speed.y = Math.sin(angle) * -pl.totalSpeed / pl.mass;
    }
}
