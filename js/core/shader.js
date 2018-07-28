/**
 * Shaders
 * @author Jani Nykänen
 */


/**
 * Load & compile a single shader
 * @param src Source
 * @param type Shader type
 */
function create_shader(src, type) {

    var gl = graph.glctx;

    // Create & compile
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    // Check for errors
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        // Delete shader? finally ?
        throw new DOMException("Shader error:\n" + gl.getShaderInfoLog(shader));
    }

    return shader;
}


/**
 * Constructor
 * @param vertex Vertex shader content
 * @param frag Fragment shader content
 */
var Shader = function(vertex, frag) {

    var gl = graph.glctx;

    this.vertex = vertex;
    this.frag = frag;
    this.program = null;

    // Build
    this.build();

    // Get uniforms
    gl.useProgram(this.program);

    this.unifModel = gl.getUniformLocation(this.program, "model");
    this.unifView = gl.getUniformLocation(this.program, "project");
    this.unifPos = gl.getUniformLocation(this.program, "pos");
    this.unifSize = gl.getUniformLocation(this.program, "size");
    this.unifTexPos = gl.getUniformLocation(this.program, "texPos");
    this.unifTexSize = gl.getUniformLocation(this.program, "texSize");
    this.unifColor = gl.getUniformLocation(this.program, "color");
}


/**
 * Build shader
 */
Shader.prototype.build = function() {

    var gl = graph.glctx;

    var vertex = create_shader(this.vertex, gl.VERTEX_SHADER);
    var frag = create_shader(this.frag, gl.FRAGMENT_SHADER);

    // Build program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, frag);

    // Bind locations
    this.bindLocations();

    // Link
    gl.linkProgram(this.program);

    // Check for errors
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {

        throw new DOMException("Shader error: " + gl.getProgramInfoLog(this.program));
    }
}


/**
 * Bind default locations
 */
Shader.prototype.bindLocations = function() {

    var gl = graph.glctx;

    gl.bindAttribLocation(this.program, 0, "vertexPos");
    gl.bindAttribLocation(this.program, 1, "vertexUV");
}


/**
 * Use the shader
 */
Shader.prototype.use = function() {

    var gl = graph.glctx;

    gl.useProgram(this.program);

    // Set default uniforms
    var id = (new Mat3());
    id.identity();
    this.set_unif_transf(id, id);
    this.set_unif_vertex([0.0, 0.0], [1.0, 1.0]);
    this.set_unif_color(1,1,1,1);
    this.set_unif_uv([0,0],[1,1]);
}


/**
 * Set transformation uniforms
 * @param model Model matrix
 * @param project Projection matrix
 */
Shader.prototype.set_unif_transf = function(model, project) {

    var gl = graph.glctx;
    gl.uniformMatrix3fv(this.unifModel, false, model.toFloat32Array());
    gl.uniformMatrix3fv(this.unifView, false, project.toFloat32Array());
}


/**
 * Set vertex position uniforms
 * @param pos Position
 * @param size Size
 */
Shader.prototype.set_unif_vertex = function(pos, size) {

    var gl = graph.glctx;
    gl.uniform2f(this.unifPos, pos[0], pos[1]);
    gl.uniform2f(this.unifSize,size[0], size[1]);
}


/**
 * Set uv position uniforms
 * @param pos Position
 * @param size Size
 */
Shader.prototype.set_unif_uv = function(pos, size) {

    var gl = graph.glctx;
    gl.uniform2f(this.unifTexPos, pos[0], pos[1]);
    gl.uniform2f(this.unifTexSize,size[0], size[1]);
}


/**
 * Set color uniform
 * @param r Red
 * @param g Green
 * @param b Blue
 * @param a Alpha
 */
Shader.prototype.set_unif_color = function(r, g, b, a) {

    var gl = graph.glctx;
    gl.uniform4f(this.unifColor, r, g, b, a);
}
