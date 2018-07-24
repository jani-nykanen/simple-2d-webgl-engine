// Explosion
// (c) 2018 Jani Nykänen

// Constants
const EXP_TIME_MAX = 60.0;
const EXP_DEATH_MAX = 30.0;
const EXP_ANIM_SPEED = 0.2;
const EXP_APPEAR_MAX = 10.0;
const EXP_SCALE_UP_SPEED = 0.025;

// Constructor
var Explosion = function() {

    this.pos = {x: 0, y: 0};
    this.timer = 0.0;
    this.speed = 1.0;
    this.scale = 1.0;
    this.exist = false;
    this.dying = false;
    this.deathTimer = 0.0;
    this.animTimer = 0.0;
}


// Create me
Explosion.prototype.create_self = function(x, y, speed, scale) {

    this.pos.x = x;
    this.pos.y = y;
    this.speed = speed;
    this.timer = -EXP_APPEAR_MAX;
    this.animTimer = 0.0;
    this.scale = 0.0;
    this.targetScale = scale;

    this.deathTimer = 0.0;
    this.dying = false;
    this.exist = true;

    this.radius = this.targetScale * 96;
}


// Update
Explosion.prototype.update = function(tm) {

    if(!this.exist) {

        // Die
        if(this.dying) {

            this.deathTimer -= 1.0 * tm;
            this.scale += EXP_SCALE_UP_SPEED * tm;
            if(this.deathTimer <= 0.0) {
                this.dying = false;
            }
        }
        return;
    }

    // Update timers
    if(this.timer < 0.0) {

        this.timer += 1.0 * tm;
        this.scale = (1.0 - (-this.timer / EXP_APPEAR_MAX) ) * this.targetScale;
    }
    else {

        this.scale = this.targetScale;

        this.timer += this.speed * tm;
        if(this.timer >= EXP_TIME_MAX) {
            
            this.dying = true;
            this.exist = false;
            this.deathTimer = EXP_DEATH_MAX;
            return;
        }
        this.animTimer += EXP_ANIM_SPEED * tm;

    }
}


// Draw
Explosion.prototype.draw = function() {

    if(!this.exist && !this.dying) return;

    const SCALE_MOD = 0.25;

    let scalePlus1 = Math.sin(this.animTimer) * SCALE_MOD;
    let t1 = this.scale + scalePlus1;

    let scalePlus2 = Math.cos(this.animTimer) * SCALE_MOD;
    let t2 = this.scale + scalePlus2;

    let spcAlphaEnabled = false;
    let spcAlpha = 1.0;
    if(this.timer < 0.0) {

        spcAlpha = 1.0 - (-this.timer / EXP_APPEAR_MAX);
        spcAlphaEnabled = true;
    }
    if(this.dying) {

        spcAlpha = this.deathTimer / EXP_DEATH_MAX;
        spcAlphaEnabled = true;
    }
    if(spcAlphaEnabled) {

        graph.set_color(1,1,1, spcAlpha);
    }

    tr.push();
    tr.translate(this.pos.x, this.pos.y);
    tr.use_transform();
    
    // Background
    graph.draw_scaled_bitmap_region(assets.bitmaps.explosion,
        0,0,256,256,
        -128 * t1, -128 * t1, 256*t1, 256*t1, 0);

    // Text
    graph.draw_scaled_bitmap_region(assets.bitmaps.explosion,
         256,0,256,256,
        -128 * t2, -128 * t2, 256*t2, 256*t2, 0);
    
    tr.pop();

    if(spcAlphaEnabled) {

        graph.set_color(1,1,1,1);
    }
}
