/**
 * Global scene
 * @author Jani Nykänen
 */

// Global object
global = {};

// TEST
angle = 0.0;


/**
 * Initialize
 */
global.init = function() {
    
    console.log("Beep boop");
}


/**
 * Update
 * @param tm Time mul.
 */
global.update = function(tm) {

    angle += 0.05 * tm;
}


/**
 * Draw
 */
global.draw = function() {

    tr.fit_view_height(720.0);

    tr.identity();
    tr.use_transform();

    graph.set_color(1, 0, 0, 1);
    graph.fill_rectangle(128,128,128,128);

    graph.set_color(0, 0, 1, 0.5);
    graph.fill_rectangle(192,192,128,128);
}


/**
 * On change
 */
global.on_change = function() {

}


// Add scene
core.add_scene(new Scene(global.init, global.update, global.draw, global.on_change ));
