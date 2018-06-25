/**
 * A matrix library for 3x3 matrices for 2D transformations
 * @author Jani Nykänen
 */

/**
 * "Empty" constructor
 */
var Mat3 = function() {

    this.m11 = 0; this.m21 = 0; this.m31 = 0;
    this.m12 = 0; this.m22 = 0; this.m32 = 0;
    this.m13 = 0; this.m32 = 0; this.m33 = 0;
}


/**
 * Set to identity matrix
 */
Mat3.prototype.identity = function() {

    this.m11 = 1; this.m21 = 0; this.m31 = 0;
    this.m12 = 0; this.m22 = 1; this.m32 = 0;
    this.m13 = 0; this.m23 = 0; this.m33 = 1;
}


/**
 * Right-side multiplication
 * @param M Right-side operand
 * @return Result matrix
 */
Mat3.prototype.mul = function(M) {

    var A = new Mat3();

    A.m11 = this.m11 * M.m11 + this.m21 * M.m12 + this.m31 * M.m13;
    A.m21 = this.m11 * M.m21 + this.m21 * M.m22 + this.m31 * M.m23;
    A.m31 = this.m11 * M.m31 + this.m21 * M.m32 + this.m31 * M.m33;

    A.m12 = this.m12 * M.m11 + this.m22 * M.m12 + this.m32 * M.m13;
    A.m22 = this.m12 * M.m21 + this.m22 * M.m22 + this.m32 * M.m23;
    A.m32 = this.m12 * M.m31 + this.m22 * M.m32 + this.m32 * M.m33;

    A.m13 = this.m13 * M.m11 + this.m23 * M.m12 + this.m33 * M.m13;
    A.m23 = this.m13 * M.m21 + this.m23 * M.m22 + this.m33 * M.m23;
    A.m33 = this.m13 * M.m31 + this.m23 * M.m32 + this.m33 * M.m33;

    return A;
}


/**
 * Set to translation matrix
 * @param x X translation
 * @param y Y translation
 */
Mat3.prototype.translate = function(x, y) {

    this.m11 = 1; this.m21 = 0; this.m31 = x;
    this.m12 = 0; this.m22 = 1; this.m32 = y;
    this.m13 = 0; this.m23 = 0; this.m33 = 1;
}


/**
 * Set to scaling matrix
 * @param x X scale
 * @param y Y scale
 */
Mat3.prototype.scale = function(x, y) {

    this.m11 = x; this.m21 = 0; this.m31 = 0;
    this.m12 = 0; this.m22 = y; this.m32 = 0;
    this.m13 = 0; this.m23 = 0; this.m33 = 1;
}


/**
 * Set to rotation matrix
 * @param angle Angle
 */
Mat3.prototype.rotate = function(angle) {

    var c = Math.cos(angle);
    var s = Math.sin(angle);

    this.m11 = c; this.m21 =-s; this.m31 = 0;
    this.m12 = s; this.m22 = c; this.m32 = 0;
    this.m13 = 0; this.m23 = 0; this.m33 = 1;
}


/**
 * Set 2D ortho projection
 * @param top Top
 * @param left Left
 * @param bottom Bottom
 * @param right Right
 */
Mat3.prototype.ortho2D = function(left, right, bottom, top) {

    var w = right - left;
    var h = top - bottom;

    this.m11 = 2.0 / w; this.m21 = 0; this.m31 = -(right+left)/w;
    this.m12 = 0; this.m22 = -2.0 / h; this.m32 = (top+bottom)/h;
    this.m13 = 0; this.m23 = 0; this.m33 = 1;
}


/**
 * Create a clone of this matrix
 * @return Clone
 */
Mat3.prototype.clone = function() {

    var A = new Mat3();
    A.m11 = this.m11; A.m21 = this.m21; A.m31 = this.m31;
    A.m12 = this.m11; A.m22 = this.m21; A.m32 = this.m31;
    A.m13 = this.m11; A.m23 = this.m21; A.m33 = this.m31;

    return A;
}


/**
 * Convert matrix to a float32 array
 * @return Array
 */
Mat3.prototype.toFloat32Array = function() {

    return new Float32Array([
        this.m11 , this.m12 , this.m13,
        this.m21 , this.m22 , this.m23,
        this.m31 , this.m32 , this.m33,
    ]);
}