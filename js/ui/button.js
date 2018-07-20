/**
 * Button
 * @author Jani Nykänen
 */

 /**
  * Constructor
  * @param text Button text
  * @param w Width
  * @param h Height
  * @param cb Callback
  */
var Button = function(text, w, h, cb) {
    
    this.x = 0;
    this.y = 0;
    this.width = w;
    this.height = h;

    this.text = text;
    this.textOrientation = {
        x: 0.5,
        y: 0.5
    };

    this.icon = {
        sx: 0,
        sy: 0,
        sw: 0,
        sh: 0 
    };

    this.cb = cb;

    this.down = false;
    this.overlay = false;
}


/**
 * Handle button input
 */
Button.prototype.get_input = function() {

    var p = input.cursor_pos();
    this.overlay = p.x >= this.x && p.x <= this.x + this.width
        && p.y >= this.y && p.y <= this.y + this.height;

    if(this.overlay && input.mouse_state(1) == state.PRESSED) {

        this.down = true;
    }
    if(!this.overlay)
        this.down = false;

    if(this.down && input.mouse_state(1) == state.RELEASED) {

        if(this.cb != null) {

            this.cb();
        }
    }
}


/**
 * Draw a button
 * @param font Bitmap font
 * @param symbols Symbol bitmap
 */
Button.prototype.draw = function(font, symbols) {

    // ...
}
