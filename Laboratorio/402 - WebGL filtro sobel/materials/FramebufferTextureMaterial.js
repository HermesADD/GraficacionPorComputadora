class FramebufferTextureMaterial extends Material {
  constructor(gl) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec2 a_texcoord;
    out vec2 v_texcoord;

    void main() {
      v_texcoord = a_texcoord;
      gl_Position = a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec2 v_texcoord;

    uniform sampler2D u_texture;

    out vec4 pixelColor;

    void main() {
      // tamaño del desplazamiento en u y v de un texel
      // la función texureSize devuelve un vector (ivec) con el tamaño de la imagen
      //vec2 tex_offset = 1.0 / vec2( textureSize(u_texture, 0) );
      pixelColor = texture(u_texture, v_texcoord);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);
  }
}