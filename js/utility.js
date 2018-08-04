// Utility functions
// (c) 2018 Jani Nykänen

// Utility object
util = {};


// Draw the pause box
util.draw_box = function(w, h) {

    const OUTER_W = 8;
    const INNER_W = 8;

    let sum = OUTER_W + INNER_W;

    let x = -w/2;
    let y = -h/2;

    graph.set_color(0.75, 0.75, 0.75, 0.75);
    graph.fill_rectangle(x - sum, y - sum, w + sum*2, h + sum*2);

    graph.set_color(0, 0, 0, 1);
    graph.fill_rectangle(x - INNER_W, y - INNER_W, w + INNER_W*2, h + INNER_W*2);

    graph.set_color(1, 1, 1, 1);
    graph.draw_scaled_bitmap_region(
        assets.bitmaps.bg,0,0,512,512,
        x , y, w , h );
}


// Get time string
util.get_time_string = function(time) {

    let t = Math.floor(time / 60.0);
    let sec = t % 60;
    let min = Math.floor(t / 60);
    let rem = time % 60;
    rem = Math.floor(100.0/60.0 * rem);

    let out = String(min) + ":";
    if(sec < 10) out += "0";
    out += String(sec) + ":";
    if(rem < 10) out += "0";
    out += String(rem);

    return out;
}
