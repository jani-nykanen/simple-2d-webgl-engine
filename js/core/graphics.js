/**
 * Graphics routines
 * @author Jani Nykänen
 */

// Global constants
FLIP_NONE = 0;
FLIP_H = 1;
FLIP_V = 2;
FLIP_H_V = 3;


// Graphics object
graph = {};

// Canvas
graph.canvas = {};
// Context
graph.glctx = null;


// Default vertex shader
const DEFAULT_VERTEX_SHADER = 
   `
attribute vec2 vertexPos;
attribute vec2 vertexUV;
   
uniform mat3 model;
uniform mat3 project;
   
uniform vec2 pos;
uniform vec2 size;
   
varying vec2 uv;
   
// Main
void main() {
   
    vec2 p = vertexPos.xy;
   
    // Set screen coordinates
    p.x *= size.x;
    p.y *= size.y;
    p += pos;
   
    // Position
    gl_Position = vec4(project * model * vec3(p.x, p.y, 1), 1);
       
    // Texture coordinates
    uv = vertexUV;
}`

// Default fragment shader
const DEFAULT_FRAG_SHADER =
`
precision mediump float;
 
varying vec2 uv;

uniform sampler2D texSampler;

uniform vec2 texPos;
uniform vec2 texSize;
uniform vec4 color;

// Main
void main() {

    const float DELTA = 0.01;

    vec2 tex = uv;    

    // Set bitmap coordinates
    tex.x *= texSize.x;
    tex.y *= texSize.y;
    tex += texPos;
    
    // Check if the color alpha is not too small
    vec4 res = color * texture2D(texSampler, tex);
    if(res.a <= DELTA) {
        
        discard;
    }

    // Set color
    gl_FragColor = res;
}
`
// Default shader
graph.defShader = null;

// Rectangle mesh buffer
graph.rectangle = {
    vertexBuffer: null,
    uvBuffer: null,
    indexBuffer: null,
};
// White texture
graph.texWhite = null;
// Previous bitmap
graph.prevBitmap = null;


/**
 * Create rectangle mesh
 */
graph.create_rect_mesh = function() {

    var gl = graph.glctx;

    const VERTICES = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];

    const INDICES = [
        0,1,2, 2,3,0
    ]

    const UVS = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];

    // Create buffers
    graph.rectangle.vertexBuffer = gl.createBuffer();
    graph.rectangle.uvBuffer = gl.createBuffer();
    graph.rectangle.indexBuffer = gl.createBuffer();

    // Set data
    gl.bindBuffer(gl.ARRAY_BUFFER, graph.rectangle.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(VERTICES),
        gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graph.rectangle.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
                new Uint16Array(INDICES),
                gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, graph.rectangle.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 
            new Float32Array(UVS),
            gl.STATIC_DRAW);
}



/**
 * Create a white texture
 */
graph.create_white_texture = function() {

    var gl = graph.glctx;

    graph.texWhite = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, graph.texWhite);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,
        gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
}


/**
 * Bind rectangle mesh buffers
 * We never change the mesh we render so we only have
 * to bind these once
 */
graph.bind_buffers = function() {

    var gl = graph.glctx;

    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangle.vertexBuffer);
    gl.vertexAttribPointer( 0, 2, gl.FLOAT, gl.FALSE,0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectangle.uvBuffer);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE,0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rectangle.indexBuffer);
}
   

/**
 * Initialize graphics
 */
graph.init = function() {

    // Get canvas
    graph.canvas = document.getElementById("webgl_canvas");
    // Get GL context
    graph.glctx = graph.canvas.getContext("webgl");
    if(graph.glctx == null) {

        throw new DOMException("Failed to initialize WebGL context!");
    }
    // Resize canvas to fit the document
    graph.resize(window.innerWidth, window.innerHeight);

    // Create shader
    graph.defShader = new Shader(DEFAULT_VERTEX_SHADER, DEFAULT_FRAG_SHADER);
    graph.defShader.use();

    // Create meshes & textures
    graph.create_rect_mesh();
    graph.create_white_texture();

    // Enable GL content & other things
    var gl = graph.glctx;
    gl.activeTexture(gl.TEXTURE0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable( gl.BLEND );

    // Bind buffers
    graph.bind_buffers();
    
}


/**
 * Resize canvas
 * @param w Width
 * @param h Height
 */
graph.resize = function(w, h) {

    var gl = graph.glctx;
    gl.viewport(0,0,w,h);

    graph.canvas.width = w;
    graph.canvas.height = h;
}


/**
 * Clear screen
 * @param {uint8} r Red 
 * @param {uint8} g Green
 * @param {uint8} b Blue
 */
graph.clear = function(r, g, b) {

    var gl = graph.glctx;
    gl.clearColor(r, g, b, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


/**
 * Draw the rectangular mesh
 */
graph.draw_rect_mesh = function() {

    var gl = graph.glctx;
    gl.drawElements(gl.TRIANGLES,6, gl.UNSIGNED_SHORT, 0);
}


/**
 * Draw a filled rectangle
 * @param x X coordinate
 * @param y Y coordinate
 * @param w Width
 * @param h Height
 */
graph.fill_rectangle = function(x, y, w, h) {

    var gl = graph.glctx;
    gl.bindTexture(gl.TEXTURE_2D, this.texWhite);

    this.defShader.set_unif_vertex([x, y], [w, h]);
    this.draw_rect_mesh();
}


/**
 * Set the global rendering color
 * @param r Red
 * @param g Green
 * @param b Blue
 * @param a Alpha
 */
graph.set_color = function(r, g, b, a) {

    this.defShader.set_unif_color(r, g, b, a);
}


/**
 * Draw a bitmap
 */
graph.draw_bitmap = function(bmp, x, y, flip) {

    var gl = graph.glctx;

    if(this.prevBitmap != bmp) {

        gl.bindTexture(gl.TEXTURE_2D, bmp.texture);
    }

    var w = bmp.width;
    var h = bmp.height;
    if( (flip & FLIP_H) != 0) {

        x += w;
        w *= -1;
    }
    if( (flip & FLIP_V) != 0) {

        y += h;
        h *= -1;
    }
    
    this.defShader.set_unif_vertex([x, y], [w, h]);
    this.draw_rect_mesh();
}