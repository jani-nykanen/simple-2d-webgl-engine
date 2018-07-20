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
// Is the color locked
graph.colLocked = false;
// Old color
graph.oldColor = {r:0,g:0,b:0,a:1};
// Stored color
graph.storedColor = {r:0,g:0,b:0,a:1}; 

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
    graph.glctx = graph.canvas.getContext("webgl", {alpha:false});
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
    gl.disable(gl.DEPTH_TEST);
    gl.enable( gl.BLEND );
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

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

    var bmp = this.texWhite;
    if(this.prevBitmap != bmp) {

        this.prevBitmap = bmp;
        gl.bindTexture(gl.TEXTURE_2D, bmp);
    }

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

    if(graph.colLocked) {
        
        this.defShader.set_unif_color(
            graph.oldColor.r, graph.oldColor.g, graph.oldColor.b , 
            graph.oldColor.a * a);

        return;
    }

    this.defShader.set_unif_color(r, g, b , a );

    graph.oldColor.r = r;
    graph.oldColor.g = g;
    graph.oldColor.b = b;
    graph.oldColor.a = a;
}


/**
 * Draw a bitmap
 * @param bmp Bitmap
 * @param x X coordinate
 * @param y Y coordinate
 * @param flip Flipping flag
 */
graph.draw_bitmap = function(bmp, x, y, flip) {

    this.draw_scaled_bitmap_region(bmp, 0, 0, bmp.width, bmp.height,
        x,y, bmp.width, bmp.height, flip);
}


/**
 * Draw a scaled bitmap
 * @param bmp Bitmap
 * @param x X coordinate
 * @param y Y coordinate
 * @param sx Scale X
 * @param sy Scale Y
 * @param flip Flipping flag
 */
graph.draw_scaled_bitmap = function(bmp, x, y, sx, sy, flip) {

    this.draw_scaled_bitmap_region(bmp, 0, 0, bmp.width, bmp.height,
        x,y, bmp.width * sx, bmp.height * sy, flip);
}


/**
 * Draw a bitmap region
 * @param bmp Bitmap
 * @param sx Source x
 * @param sy Source y
 * @param sw Source width
 * @param sh Source height
 * @param dx Destination x
 * @param dy Destination y
 * @param flip Flipping flag
 */
graph.draw_bitmap_region = function(bmp, sx, sy, sw, sh, dx, dy, flip) {

    this.draw_scaled_bitmap_region(bmp, sx,sy,sw,sh,dx,dy,sw,sh, flip);
}


/**
 * Draw a scaled bitmap region
 * @param bmp Bitmap
 * @param sx Source x
 * @param sy Source y
 * @param sw Source width
 * @param sh Source height
 * @param dx Destination x
 * @param dy Destination y
 * @param dw Destination width
 * @param dh Destination height
 * @param flip Flipping flag
 */
graph.draw_scaled_bitmap_region = function(bmp, sx,sy,sw,sh,dx,dy,dw,dh, flip) {

    flip = flip | FLIP_NONE;

    var gl = graph.glctx;
    if(this.prevBitmap != bmp) {

        gl.bindTexture(gl.TEXTURE_2D, bmp.texture); 
        this.prevBitmap = bmp;
    }

    var w = bmp.width;
    var h = bmp.height;
    if( (flip & FLIP_H) != 0) {

        dx += dw;
        dw *= -1;
    }
    if( (flip & FLIP_V) != 0) {

        dy += dh;
        dh *= -1;
    }
    
    this.defShader.set_unif_vertex([dx, dy], [dw, dh]);
    this.defShader.set_unif_uv([sx / bmp.width, sy / bmp.height], [sw / bmp.width, sh / bmp.height]);
    this.draw_rect_mesh();
}


/**
 * Draw text using a bitmap font
 * @param bmp Bitmap
 * @param text Text to be drawn
 * @param dx Destination x
 * @param dy Destination y
 * @param xoff X offset
 * @param yoff Y offset
 * @param center Center the text or not
 */
graph.draw_text = function(bmp, text, dx, dy, xoff, yoff, center) {

    center = center == null ? false : center;

    var cw = bmp.width / 16;
    var ch = cw;
    var len = text.length;
    var x = dx;
    var y = dy;

    if(center) {

        dx -= ( (len+1)/2.0 * (cw+xoff) );
        x = dx;
    }

    for(var i = 0; i < len;  ++ i) {

        c = text.charCodeAt(i);
        if(text[i] == '\n') {

            x = dx;
            y += yoff + ch;
            continue;
        }

        sx = c % 16;
        sy = (c / 16) | 0;

        this.draw_bitmap_region(bmp,sx*cw,sy*ch,cw,ch,x,y, FLIP_NONE);

        x += cw + xoff;
    }
}


/**
 * Toggle color lock
 * @param state State
 */
graph.toggle_color_lock = function(state) {

    graph.colLocked = state;
}


/**
 * Set back to the locked color
 */
graph.set_to_locked_color = function() {
    
    if(!graph.colLocked) return;

    this.defShader.set_unif_color(
        graph.oldColor.r, graph.oldColor.g, graph.oldColor.b , 
        graph.oldColor.a);
}
