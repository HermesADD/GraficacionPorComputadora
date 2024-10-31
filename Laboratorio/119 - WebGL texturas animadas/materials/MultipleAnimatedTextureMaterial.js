class MultipleAnimatedTextureMaterial extends Material {
  constructor(gl, image1, image2, image3) {
    let vertexShaderSource = 
    `#version 300 es

    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;

    out vec2 v_texcoord;

    uniform mat4 u_PVM_matrix;

    void main() {
      v_texcoord = a_texcoord;
      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    uniform float u_delta;

    in vec2 v_texcoord;
    uniform sampler2D u_texture_1;
    uniform sampler2D u_texture_2;
    uniform sampler2D u_texture_3;

    out vec4 pixelColor;

    void main() {
      vec4 colorTex1 = texture(u_texture_1, v_texcoord);
      vec4 colorTex2 = texture(u_texture_2, vec2(v_texcoord.x+u_delta/10.0, v_texcoord.y));
      vec4 colorTex3 = texture(u_texture_3, vec2(v_texcoord.x+u_delta/5.0, v_texcoord.y));

      pixelColor = mix ( mix( colorTex1, colorTex2, colorTex2.a ), colorTex3, colorTex3.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);

    ////////////////////////////////////////////////////////////////////
    this.texture_1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture_1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.texture_2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture_2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.texture_3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.texture_3);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}