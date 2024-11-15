class FramebufferSobelMaterial extends Material {
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
      vec2 tex_offset = 1.0 / vec2( textureSize(u_texture, 0) );

      vec4 pixelCentral = texture(u_texture, vec2(v_texcoord.x, v_texcoord.y));


      // c00 c10 c20
      // c01 c11 c21
      // c02 c12 c22
      vec3 c00 = texture(u_texture, vec2(v_texcoord.x-tex_offset.x, v_texcoord.y-tex_offset.y)).rgb;
      vec3 c10 = texture(u_texture, vec2(v_texcoord.x, v_texcoord.y-tex_offset.y)).rgb;
      vec3 c20 = texture(u_texture, vec2(v_texcoord.x+tex_offset.x, v_texcoord.y-tex_offset.y)).rgb;
      vec3 c01 = texture(u_texture, vec2(v_texcoord.x-tex_offset.x, v_texcoord.y)).rgb;
      vec3 c11 = pixelCentral.rgb;
      vec3 c21 = texture(u_texture, vec2(v_texcoord.x+tex_offset.x, v_texcoord.y)).rgb;
      vec3 c02 = texture(u_texture, vec2(v_texcoord.x-tex_offset.x, v_texcoord.y+tex_offset.y)).rgb;
      vec3 c12 = texture(u_texture, vec2(v_texcoord.x, v_texcoord.y+tex_offset.y)).rgb;
      vec3 c22 = texture(u_texture, vec2(v_texcoord.x+tex_offset.x, v_texcoord.y+tex_offset.y)).rgb;

      // filtro sobel para obtener bordes verticales
      // 1 0 -1
      // 2 0 -2
      // 1 0 -1
      vec3 bordeVertical = 
        1.0*c00 + 0.0*c10 + -1.0*c20 + 
        2.0*c01 + 0.0*c11 + -2.0*c21 + 
        1.0*c02 + 0.0*c12 + -1.0*c22;  

      // filtro sobel para obtener bordes horizontales
      //  1  2  1
      //  0  0  0
      // -1 -2 -1
      vec3 bordeHorizontal = 
        1.0*c00 + 2.0*c10 + 1.0*c20 + 
        0.0*c01 + 0.0*c11 + 0.0*c21 + 
        -1.0*c02 + -2.0*c12 + -1.0*c22;  

      pixelColor = vec4(bordeVertical+bordeHorizontal, 1.0);
      //pixelColor = vec4(pixelCentral.rbg + (bordeVertical+bordeHorizontal), pixelCentral.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);
  }
}