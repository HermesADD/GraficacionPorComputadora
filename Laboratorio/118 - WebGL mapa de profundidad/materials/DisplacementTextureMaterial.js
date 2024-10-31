class DisplacementTextureMaterial extends Material {
  constructor(gl, image) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;

    out vec2 v_texcoord;

    uniform mat4 u_PVM_matrix;
    uniform sampler2D u_texture;

    void main() {
      float offset = 1.0*texture(u_texture, a_texcoord).r;

      v_texcoord = a_texcoord;
      gl_Position = u_PVM_matrix * vec4((a_position.xyz + offset*a_normal), a_position.w);
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec2 v_texcoord;
    uniform sampler2D u_texture;

    out vec4 pixelColor;

    void main() {
      pixelColor = texture(u_texture, v_texcoord);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);

    ////////////////////////////////////////////////////////////////////
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

  }
}