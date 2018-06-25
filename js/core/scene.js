/**
 * Scene
 * @author Jani Nykänen
 */

 
/**
 * Constructor for scene
 * @param init Called when the application is initialized
 * @param update Called when the frame is updated
 * @param draw Called when the frame is drawn
 * @param change Called when the scene is changed to this scene
 */
var Scene = function(init, update, draw, change) {

    this.on_init = init;
    this.on_update = update;
    this.on_draw = draw;
    this.on_change = change;
}
