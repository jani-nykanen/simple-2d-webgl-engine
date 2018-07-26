// Loading screen
// (c) 2018 Jani Nykänen

// Loading object
var loading = {};


// Draw loading screen
loading.draw = function() {

    let bmp = assets.bitmaps.font;

    // Set transformation
    tr.fit_view_height(720.0);
    tr.identity();
    tr.use_transform();

    graph.clear(1, 1, 1);

    let x = tr.viewport.w / 2;
    let y = tr.viewport.h / 2 - 32;

    graph.set_color(1,1,1,1);
    graph.draw_text(bmp, "Loading " + String(assets.get_percentage()), x, y, -16, 0, true);

}
core.set_loading_func(loading.draw);
