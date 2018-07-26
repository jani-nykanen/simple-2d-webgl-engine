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
// Time (in frames)
_status.time = 0;


// Get time string
_status.get_time_string = function() {

    let t = Math.floor(_status.time / 60.0);
    let sec = t % 60;
    let min = Math.floor(t / 60);

    let out = String(min) + ":";
    if(sec < 10) out += "0";
    out += String(sec);

    return out;
}


// Update status
_status.update = function(tm) {

    // Update drawn health value
    if(_status.oldHealth > _status.health) {

        _status.oldHealth -= HEALTH_BAR_SPEED * tm;
        if(_status.oldHealth < _status.oldHealth) {

            _status.oldHealth = _status.health;
        }
    }

    // Update time
    _status.time += 1.0 * tm;
}


// Draw health
_status.draw_health = function() {

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

    // Draw black parts
    graph.draw_scaled_bitmap_region(assets.bitmaps.healthBar,
        0, 192, 272, 96,
        x, y, 272*BAR_SCALE, 96*BAR_SCALE, 0);
}


// Draw status
_status.draw = function() {

    // Draw health
    _status.draw_health();

    // Draw time
    let x = tr.viewport.w / 2;
    graph.draw_text(assets.bitmaps.font, "TIME:",x,4,-24,0, true, 0.625);
    graph.draw_text(assets.bitmaps.font, this.get_time_string(),x,8 + 32,-24,0, true, 1.0);
}


// Reduce health
_status.reduce_health = function(amount) {

    this.health -= amount;
    if(this.health < 0.0) {

        this.health = 0.0;
    }
}
