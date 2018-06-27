/**
 * Global scene
 * @author Jani Nykänen
 */

// Game object
game = {};

// TEST
angle = 0.0;


/**
 * Initialize
 */
game.init = function() {
    
    console.log("Beep boop");
}


/**
 * Update
 * @param tm Time mul.
 */
game.update = function(tm) {

    angle += 0.05 * tm;
}


/**
 * Draw
 */
game.draw = function() {

    tr.fit_view_height(720.0);

    tr.identity();
    tr.use_transform();

    graph.set_color(1, 0, 0, 1);
    graph.fill_rectangle(128,128,128,128);

    graph.set_color(0, 0, 1, 0.5);
    graph.fill_rectangle(192,192,128,128);

    graph.set_color(1, 1, 1, 1);
    graph.draw_bitmap(assets.bitmaps.test, 256,256, FLIP_V | FLIP_H);
}


/**
 * On change
 */
game.on_change = function() {

}


// Add scene
core.add_scene(new Scene(game.init, game.update, game.draw, game.on_change ));
