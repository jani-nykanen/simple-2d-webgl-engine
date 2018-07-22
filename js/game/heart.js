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

    CollisionObject.call(this);

    this.pos.x = x;
    this.pos.y = y;
    this.scale = HEART_BASE_SCALE;
    this.bumpTimer = 0.0;
    this.bumpState = 0.0;
    this.radius = HEART_RADIUS;
    this.static = true;
    this.exist = true;
}
Heart.prototype = Object.create(CollisionObject.prototype);


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
        this.pos.x - assets.bitmaps.heart.width/2 * this.scale,
        this.pos.y - assets.bitmaps.heart.height/2 * this.scale,
        this.scale,
        this.scale,0
    );
}
