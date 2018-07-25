// Background
// (c) 2018 Jani Nykänen

// Background object
bg = {};

// Star "shining" timer
bg.starTimer = 0.0;


// Draw the background elements
bg.draw_bg_elements = function() {

    const STAR_SHINE_MUL = 0.1;
    const POS_OFF = Math.PI / 4.0;

    const SPC_ELEMENTS = [
        [3,2],
        [0, 1],
        [2,0],
        [1,3]
    ];

    var starId = 0;
    var frame, row;

    var left = -1280;
    var top = -1280;

    var scale = 2.5;
    var size = 256 * scale;
    var sizeBase = 256 * scale;
    var off = 0.0;

    graph.set_color(1,1,1, 0.35);

    for(var y = 0; y < 4; ++ y) {

        for(var x = 0; x < 4; ++ x) {

            off = 0.0;
            frame = -1;
            for(var i = 0; i < 4; ++ i) {

                if(x == SPC_ELEMENTS[i][0] && y == SPC_ELEMENTS[i][1]) {

                    frame = i % 3;
                    row = Math.floor(i / 3);
                    break;
                }
            }

            if(frame == -1) {

                starId = ( (y % 2 == 0 && x % 2 == 0) || (y % 2 == 1 && x % 2 == 1) ) ? 1 : 0;
                frame = 1 + starId;
                row = 1;

                off = Math.sin(bg.starTimer + POS_OFF * (x+y)) 
                    * STAR_SHINE_MUL;
            }
            size = 256 * (scale + off);

            graph.draw_scaled_bitmap_region(assets.bitmaps.bgElements,
                frame*256,row*256,256,256,
                left + x*sizeBase - 256*off/2,top + y*sizeBase - 256*off/2,
                size,size, 0);
        }
    }

    graph.set_color(1,1,1,1);
}


// Update background
bg.update = function(tm) {

    const STAR_SHINE_SPEED = 0.05;

    bg.starTimer += STAR_SHINE_SPEED * tm;
}


// Draw background
bg.draw = function() {

    // If heart hurt (eh), make this red
    if(objman.heart.hurtTimer > 0.0) {

        let s = Math.abs(Math.sin(objman.heart.hurtTimer / HEART_HURT_MAX 
            * (Math.PI*2 * HEART_HURT_MOD))) * 0.5;
        graph.set_color(1-s*0.5,1-s,1-s, 1);
    }

    // Draw "paper"
    graph.draw_scaled_bitmap(assets.bitmaps.bg,-1280,-1280,2.5,2.5, 0);

    // Draw elements
    bg.draw_bg_elements();
}
