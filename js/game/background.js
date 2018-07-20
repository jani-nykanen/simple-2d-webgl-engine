// Background
// (c) 2018 Jani Nykänen

// Background object
bg = {};

// Draw background
bg.draw = function() {

    graph.draw_scaled_bitmap(assets.bitmaps.bg,
        -1024,-1024,2,2, 0);
}
