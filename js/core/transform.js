/**
 * Transformations
 * @author Jani Nykänen
 */

// Constants
const TARGET_MODEL = 0;
const TARGET_WORLD = 1;
const STACK_MAX = 16;

// Transformation object
tr = {};

// Matrices
tr.model = new Mat3();
tr.view = new Mat3();
tr.world = new Mat3();
tr.target = tr.model;
tr.targetID = 0;
tr.operand = new Mat3();

// Model matrix stack
tr.stack = [];
// Stack pointer
tr.stackPointer = 0;

// Viewport info
tr.viewport = {w: 1, h: 1, ratio: 1};


/**
 * Initialize
 */
tr.init = function() {

    tr.target.identity();
    tr.view.identity();
    tr.world.identity();

    for(var i = 0; i < STACK_MAX; ++ i) {

        tr.stack[i] = new Mat3();
    }
}


/**
 * Set view
 * @param w Width
 * @param h Height
 */
tr.set_view = function(w, h) {

    tr.view.ortho2D(0, w, 0, h);
    tr.viewport.w = w;
    tr.viewport.h = h;
    tr.ratio = w / h;
}


/**
 * Fit view with fixed height
 * @param h Height
 */
tr.fit_view_height = function(h) {

    var ratio = graph.canvas.width / graph.canvas.height;
    var w = ratio * h;

    tr.translate_world(0, 0);
    tr.set_view(w, h);
}


/**
 * Fit view with fixed height and center it
 * @param h Height
 * @param sx Scale X
 * @param sy Scale y
 */
tr.fit_view_height_center = function(h, sx, sy) {

    sx = sx || 1;
    sy = sy || 1;

    h *= sy;
    var ratio = graph.canvas.width / graph.canvas.height;
    var w = ratio * h * sx;

    var x = w / 2;
    var y = h / 2

    tr.translate_world(x, y);
    tr.set_view(w, h);
}



/**
 * Set model matrix to the identity matrix
 */
tr.identity = function() {

    tr.model.identity();
}


/**
 * Translate
 * @param x X translation
 * @param y Y  translation
 */
tr.translate = function(x, y) {

    tr.operand.translate(x, y);
    tr.model = tr.model.mul(tr.operand);
}


/**
 * Scale
 * @param x X scaling
 * @param y Y  scaling
 */
tr.scale = function(x, y) {

    tr.operand.scale(x, y);
    tr.model = tr.model.mul(tr.operand);
}


/**
 * Rotate
 * @param angle Angle
 */
tr.rotate = function(angle) {

    tr.operand.rotate(angle);
    tr.model = tr.model.mul(tr.operand);
}


/**
 * Push
 */
tr.push = function() {

    tr.stack.push(tr.model.clone());
}


/**
 * Pop
 */
tr.pop = function() {

    tr.model = tr.stack.pop();
    tr.use_transform();
}


/**
 * Use the current transform
 */
tr.use_transform = function() {

    var pr = graph.defShader;
    var out = this.world.mul(this.model);
    pr.set_unif_transf(out, this.view);
}


/**
 * Translate world
 * @param x X translation
 * @param y Y translation
 */
tr.translate_world = function(x, y) {

    this.world.translate(x, y);
}
