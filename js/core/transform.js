/**
 * Transformations
 * @author Jani Nykänen
 */

// Transformation object
tr = {};

// Matrices
tr.model = new Mat3();
tr.view = new Mat3();
tr.operand = new Mat3();

// Model matrix stack
tr.stack = [];


/**
 * Initialize
 */
tr.init = function() {

    tr.model.identity();
    tr.view.identity();
}


/**
 * Set view
 * @param w Width
 * @param h Height
 */
tr.set_view = function(w, h) {

    tr.view.ortho2D(0, w, 0, h);
}


/**
 * Fit view with fixed height
 * @param h Height
 */
tr.fit_view_height = function(h) {

    var ratio = graph.canvas.width / graph.canvas.height;
    var w = ratio * h;

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

    tr.model = tr.stack.pop().clone();
}


/**
 * Use the current transform
 */
tr.use_transform = function() {

    var pr = graph.defShader;
    pr.set_unif_transf(this.model, this.view);
}