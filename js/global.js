/**
 * Global scene
 * @author Jani Nykänen
 */

// Global object
global = {};


/**
 * Initialize
 */
global.init = function() {
    
    // Load assets
    assets.load({
        test: "test.png",
        font: "font.png"
    }, "assets/bitmaps");
}


/**
 * Update
 * @param tm Time mul.
 */
global.update = function(tm) {


}


/**
 * Draw
 */
global.draw = function() {

}


/**
 * On change
 */
global.on_change = function() {

}


// Add scene
core.add_scene(new Scene(global.init, global.update, global.draw, global.on_change ));
