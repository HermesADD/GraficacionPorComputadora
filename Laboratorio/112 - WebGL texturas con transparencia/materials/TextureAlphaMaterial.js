class TextureAlphaMaterial extends Material {
  constructor(gl, image) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
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

    in vec2 v_texcoord;

    uniform sampler2D u_texture;

    out vec4 pixelColor;

    void main() {
      // Se obtiene el color de la textura
      vec4 texture_color = texture(u_texture, v_texcoord);

      // Se compara el valor de la transparencia en los píxeles de la imagen, si el valor de alfa es menor que un valor dado (en este caso 0.6) entonces se descarta el fragmento
      if (texture_color.a < 0.6) {
        discard;
      }

      pixelColor = texture_color;
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    ////////////////////////////////////////////////////////////////////
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}