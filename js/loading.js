// Loading screen
// (c) 2018 Jani Nykänen

// Loading object
var loading = {};


// Draw loading screen
loading.draw = function() {

    const WIDTH = 8;

    let bmp = assets.bitmaps.font;

    // Set transformation
    tr.fit_view_height(720.0);
    tr.identity();
    tr.use_transform();

    graph.clear(1, 1, 1);

    let w = 256;
    let h = 32;

    let x = tr.viewport.w / 2 - w/2;
    let y = tr.viewport.h / 2 - h/2;

    let p = assets.get_percentage() / 100.0;
    /*
    let pstr = (p < 10 ? "0" : "" ) + String(p) + "%";

    graph.set_color(1,1,1,1);
    graph.draw_text(bmp, "Loading " + pstr, x, y, -16, 0, true);
    */

    graph.set_color(0,0,0, 1);
    graph.fill_rectangle(x-WIDTH*2,y-WIDTH*2, w+WIDTH*4, h+WIDTH*4);

    graph.set_color(1,1,1, 1);
    graph.fill_rectangle(x-WIDTH,y-WIDTH, w+WIDTH*2, h+WIDTH*2);

    graph.set_color(0,0,0, 1);
    graph.fill_rectangle(x,y,w*p,h);

    graph.set_color(1,1,1, 1);
}
core.set_loading_func(loading.draw);
