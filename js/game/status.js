// Status
// (c) 2018 Jani Nykänen

// Constants
const HEALTH_BAR_SPEED = 0.005;
const HEALTH_MIN = 0.22;
const GUIDE_MAX = 360.0;
const GUIDE_DISAPPEAR = 30.0;
const GUIDE_APPEAR = 30.0;

// Global status object
_status = {};

// Health
_status.health = 1.0;
// Old health (TODO: Rename to "drawnHealth" or something)
_status.oldHealth = 1.0;
// Time (in frames)
_status.time = 0;
// Is the game over
_status.gameOver = false;
// Guide timer
_status.guideTimer = GUIDE_MAX;
// Guide pos 
_status.guidePos = 0.0;


// Reset
_status.reset = function() {
    
    _status.health = 1.0;
    _status.oldHealth = 1.0;
    _status.time = 0;
    _status.gameOver = false;
    _status.guideTimer = GUIDE_MAX;
    _status.guidePos = 0.0;
}


// Get time string
_status.get_time_string = function() {

    let t = Math.floor(_status.time / 60.0);
    let sec = t % 60;
    let min = Math.floor(t / 60);
    let rem = _status.time % 60;
    rem = Math.floor(100.0/60.0 * rem);

    let out = String(min) + ":";
    if(sec < 10) out += "0";
    out += String(sec) + ":";
    if(rem < 10) out += "0";
    out += String(rem);

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

    // Update guide timer
    if(_status.guideTimer > 0) {

        _status.guideTimer -= 1.0 * tm;

        // Update guid pos
        let t = 1.0;
        if(this.guideTimer <= GUIDE_DISAPPEAR) {

            t = this.guideTimer / GUIDE_DISAPPEAR;
        }
        else if(this.guideTimer >= GUIDE_MAX - GUIDE_APPEAR) {

            t = (GUIDE_MAX-this.guideTimer) / GUIDE_APPEAR;
        }
        this.guidePos = t;
    }
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
    let t = w * (HEALTH_MIN + (1-HEALTH_MIN) * _status.oldHealth);

    // If hurt, make "whiter"
    if(objman.heart.hurtTimer > 0.0) {

        let s = Math.abs(Math.sin(objman.heart.hurtTimer / HEART_HURT_MAX 
            * (Math.PI*2 * HEART_HURT_MOD)));
        let t = 1 + 2*s;
        graph.set_color(t,t,t, ALPHA );
    }

    // Draw background bar (= gray)
    graph.draw_scaled_bitmap_region(assets.bitmaps.healthBar,
        t, 96, w-t, 96,
        x + t*BAR_SCALE, y, (w-t)*BAR_SCALE, 96*BAR_SCALE, 0);

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


// Draw guide
_status.draw_guide = function(t, tx, ty, txt) {

    const X_OFF = 32;
    const Y_POS = 288;
    const Y_OFF = 224;
    const SCALE = 1.25;
    const TEXT_OFF = -8;
    const TEXT_SCALE = 0.70;
    const TEXT_XOFF = -24;

    const TEXT = [
        "Turn",
        "Move",
        "Magnet",
        "Detonate"
    ]

    if(t <= 0.0) return;

    let x =  X_OFF -(128+X_OFF) * SCALE * (1.0 - t);
    let size = 128*SCALE;
    let m = (size) / 2.0;

    // Draw icons
    graph.draw_scaled_bitmap_region(assets.bitmaps.guide,
        0,0,128,128,
        tx+ x, ty+ Y_POS, size, size);

    graph.draw_scaled_bitmap_region(assets.bitmaps.guide,
        128,0,128,128,
        tx+ x, ty+ Y_POS + Y_OFF, size, size);

    graph.draw_scaled_bitmap_region(assets.bitmaps.guide,
        256,0,128,128,
        tx+ tr.viewport.w - size - x, ty+ Y_POS, size, size);

    graph.draw_scaled_bitmap_region(assets.bitmaps.guide,
        384,0,128,128,
        tx+ tr.viewport.w - size - x, 
        ty+ Y_POS + Y_OFF, size, size);

    // Draw text
    if(txt) {

        ty += TEXT_OFF;

        graph.draw_text(assets.bitmaps.font, TEXT[0],
            tx + x + m, ty + Y_POS + size, TEXT_XOFF, 0, true, TEXT_SCALE);

        graph.draw_text(assets.bitmaps.font, TEXT[1],
                tx + x + m, ty + Y_POS + size + Y_OFF, TEXT_XOFF, 
                0, true, TEXT_SCALE);

        graph.draw_text(assets.bitmaps.font, TEXT[2],
                tx + tr.viewport.w - x - m, ty + Y_POS + size, TEXT_XOFF, 0, true, TEXT_SCALE);
        
        graph.draw_text(assets.bitmaps.font, TEXT[3],
                tx + tr.viewport.w - x - m, ty + Y_POS + size + Y_OFF, TEXT_XOFF, 
                0, true, TEXT_SCALE);
    }
}


// Draw status
_status.draw = function() {

    // Draw health
    _status.draw_health();

    // Draw time
    let x = tr.viewport.w / 2;
    graph.draw_text(assets.bitmaps.font, "TIME:",x,4,-24,0, true, 0.625);
    graph.draw_text(assets.bitmaps.font, this.get_time_string(),x,8 + 32,-24,0, true, 1.0);

    // Draw guide

    graph.set_color(0,0,0, 0.25);
    _status.draw_guide(this.guidePos, 8, 8, false);
    graph.set_color(1,1,1, 0.80);
    _status.draw_guide(this.guidePos, 0, 0, true);

    graph.set_color(1,1,1,1);
}


// Reduce health
_status.reduce_health = function(amount) {

    if(_status.gameOver) return;

    this.health -= amount;
    if(this.health <= 0.0) {

        _status.gameOver = true;
        this.health = 0.0;

        // Game over!
        game.cause_game_over();
    }
}
