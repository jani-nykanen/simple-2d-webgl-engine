// Status
// (c) 2018 Jani Nykänen

// Constants
const HEALTH_BAR_SPEED = 0.005;

// Global status object
_status = {};

// Health
_status.health = 1.0;
// Old health (TODO: Rename to "drawnHealth" or something)
_status.oldHealth = 1.0;
// Time (in seconds)
_status.time = 60.0;


// Update status
_status.update = function(tm) {

    // Update drawn health value
    if(_status.oldHealth > _status.health) {

        _status.oldHealth -= HEALTH_BAR_SPEED * tm;
        if(_status.oldHealth < _status.oldHealth) {

            _status.oldHealth = _status.health;
        }
    }
}


// Draw status
_status.draw = function() {

    const BAR_SCALE = 1.5;
    const ALPHA = 0.75;

    // Draw health bar
    let x = tr.viewport.w / 2 - 144*BAR_SCALE;
    let y = tr.viewport.h - 96 * BAR_SCALE;

    graph.set_color(1,1,1, ALPHA);

    let w = assets.bitmaps.healthBar.width;
    let t = w * _status.oldHealth;

    // Draw background bar (= gray)
    graph.draw_scaled_bitmap_region(assets.bitmaps.healthBar,
        t, 96, w-t, 96,
        x + t*BAR_SCALE, y, (w-t)*BAR_SCALE, 96*BAR_SCALE, 0);

    // If hurt, make "whiter"
    if(objman.heart.hurtTimer > 0.0) {

        let s = Math.abs(Math.sin(objman.heart.hurtTimer / HEART_HURT_MAX 
            * (Math.PI*2 * HEART_HURT_MOD)));
        let t = 1 + 2*s;
        graph.set_color(t,t,t, ALPHA );
    }

    // Draw health bar (=red)
    graph.draw_scaled_bitmap_region(assets.bitmaps.healthBar,
        0, 0, t, 96,
        x, y, t*BAR_SCALE, 96*BAR_SCALE, 0);


    graph.set_color(1,1,1, 1);
}


// Reduce health
_status.reduce_health = function(amount) {

    this.health -= amount;
    if(this.health < 0.0) {

        this.health = 0.0;
    }
}
