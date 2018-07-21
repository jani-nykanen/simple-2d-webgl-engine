// Background
// (c) 2018 Jani Nykänen

// Background object
bg = {};

// Draw the background elements
bg.draw_bg_elements = function() {

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

    var size = 256*2.5;

    graph.set_color(1,1,1, 0.35);

    for(var y = 0; y < 4; ++ y) {

        for(var x = 0; x < 4; ++ x) {

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
            }

            graph.draw_scaled_bitmap_region(assets.bitmaps.bgElements,
                frame*256,row*256,256,256,
                left + x*size,top + y*size,size,size, 0);
        }
    }

    graph.set_color(1,1,1,1);
}


// Draw background
bg.draw = function() {

    // Draw "paper"
    graph.draw_scaled_bitmap(assets.bitmaps.bg,-1280,-1280,2.5,2.5, 0);

    // Draw elements
    bg.draw_bg_elements();
}
