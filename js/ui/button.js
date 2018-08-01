/**
 * Button
 * @author Jani Nykänen
 */

// Constanst
const BUTTON_XOFF = -24;
const BUTTON_SCALE_SPEED = 0.05;


 /**
  * Constructor
  * @param text Button text
  * @param x X coordinate
  * @param y Y coordinate
  * @param w Font width (or if image, image dimension)
  * @param scale Scale
  * @param center Is the button centered
  * @param cb Callback
  */
var Button = function(text, x, y, w, scale, center, cb, img) {
    
    this.cw = w / 16.0;

    this.width = ( (text.length+1) * (this.cw+BUTTON_XOFF)) * scale;
    this.height = this.cw * scale;

    this.x = center ? (x - this.width/2.0) : x;
    this.y = center ? (y - this.height/2.0) : y;
    this.scale = scale;
    this.scaleTarget = 1.0;
    this.scalePlus = 1.0;
    
    this.text = text;
    this.center = center;

    this.cb = cb;

    this.down = false;
    this.overlay = false;

    if(img) {

        this.width = w;
        this.height = w;
    }
}


/**
 * Update position
 * @param x New X coordinate
 * @param y New Y coordinate
 */
Button.prototype.update_pos = function(x, y) {

    this.x = this.center ? (x - this.width/2.0) : x;
    this.y = this.center ? (y - this.height/2.0) : y;
}


/**
 * Handle button input
 */
Button.prototype.get_input = function() {

    var p = input.cursor_pos();
    this.overlay = p.x >= this.x && p.x <= this.x + this.width
        && p.y >= this.y && p.y <= this.y + this.height;

    this.scaleTarget = this.overlay ? 1.25 : 1.0;

    if(this.overlay && input.mouse_state(0) == state.PRESSED) {

        this.down = true;
    }
    if(!this.overlay)
        this.down = false;

    if(this.down && input.mouse_state(0) == state.RELEASED) {

        if(this.cb != null) {

            this.cb();
        }
    }
}


/**
 * Update button
 * @param tm Time multiplier (required for animation)
 */
Button.prototype.update = function(tm) {

    // Get input
    this.get_input();

    // Update size
    if(this.scaleTarget > this.scalePlus) {

        this.scalePlus += BUTTON_SCALE_SPEED * tm;
        if(this.scalePlus > this.scaleTarget)
            this.scalePlus = this.scaleTarget;
    }
    else if(this.scaleTarget < this.scalePlus) {

        this.scalePlus -= BUTTON_SCALE_SPEED * tm;
        if(this.scalePlus < this.scaleTarget)
            this.scalePlus = this.scaleTarget;
    }
}


/**
 * Draw button with an image
 * @param bmp Image
 */
Button.prototype.draw_with_image = function(bmp,alpha) {

    const BG_ALPHA = 0.75;

    let alphaMul = 1.0;
    let colorMul = 1.0;
    if(!this.overlay) {

        alphaMul = 0.75;
    }
    else {

        colorMul = 1.5;
    }

    graph.set_color(1,1,1, BG_ALPHA * alpha * alphaMul);
    graph.draw_scaled_bitmap_region(bmp, 0, 0, bmp.height, bmp.height,
        this.x, this.y, this.width * this.scale, this.height * this.scale);

    graph.set_color(colorMul,colorMul,colorMul, alpha * alphaMul);
    graph.draw_scaled_bitmap_region(bmp, bmp.height, 0, bmp.height, bmp.height,
        this.x, this.y, this.width * this.scale, this.height * this.scale);
    graph.set_color(1,1,1,1);

}


/**
 * Draw a button
 * @param font Font
 * @param alpha Alpha
 */
Button.prototype.draw = function(font, alpha) {

    if(this.overlay) {

        graph.set_color(1, 1, 0.75, alpha);
    }
    else {

        graph.set_color(1, 0.90, 0, alpha);
    }

    graph.draw_text(font, this.text,
        this.x + this.width/2, (this.y+this.height/2.0) - this.cw/2.0 * this.scale * this.scalePlus,
        BUTTON_XOFF, 0, true, this.scale * this.scalePlus);

    graph.set_color(1,1,1,1);
}
