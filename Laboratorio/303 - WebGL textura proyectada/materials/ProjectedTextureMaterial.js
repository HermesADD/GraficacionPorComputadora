class ProjectedTextureMaterial extends Material {
  constructor(gl, color=[1,1,1,1]) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_texcoord;

    uniform mat4 u_PVM_matrix;
    uniform mat4 u_M_matrix;
    uniform mat4 u_texture_matrix;

    out vec4 v_projected_texcoord;

    void main() {
      v_projected_texcoord = u_texture_matrix * u_M_matrix * a_position;

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    uniform sampler2D u_projected_texture;
    uniform vec4 u_color;

    in vec4 v_projected_texcoord;

    out vec4 pixelColor;

    void main() {
      vec3 projected_texcoord = 0.5 + (v_projected_texcoord.xyz / v_projected_texcoord.w)/2.0;
 
      bool inRange = projected_texcoord.x >= 0.0 && 
                     projected_texcoord.x <= 1.0 &&
                     projected_texcoord.y >= 0.0 && 
                     projected_texcoord.y <= 1.0;
     
      vec4 projectedTexColor = texture(u_projected_texture, projected_texcoord.xy);
     
      pixelColor = mix(u_color, projectedTexColor, (inRange ? 1.0 : 0.0));
    }`;

    // Se llama al constructor de la clase Material
    super(gl, color, vertexShaderSource, fragmentShaderSource);
  }
}