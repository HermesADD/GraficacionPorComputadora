class ProjectedTextureMaterial extends Material {
  constructor(gl, color=[1,1,1,1]) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;

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
 
      float closestDepth = texture(u_projected_texture, projected_texcoord.xy).r;
      float currentDepth = projected_texcoord.z;
      float shadow = (currentDepth > closestDepth) ? 1.0 : 0.0; 
      pixelColor = mix(u_color, vec4(0.0, 0.0, 0.0, 1.0), shadow);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, color, vertexShaderSource, fragmentShaderSource);
  }
}