class DiffuseAmbientMaterial extends Material{
  constructor(gl,ka= [0,0,0], kd= [0,0,0], color=[1,1,1,1]) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;

    void main() {
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;

    uniform vec3 u_light_position;
    uniform vec4 u_color;
    uniform vec3 u_La;
    uniform vec3 u_Ka;
    uniform vec3 u_Ld;
    uniform vec3 u_Kd;

    out vec4 pixelColor;

    void main() {
      vec3 to_light = normalize( u_light_position - v_position );

      vec3 fragment_normal = normalize(v_normal);

      float cos_angle = max(dot(fragment_normal, to_light), 0.0);

      pixelColor = vec4(u_La * u_Ka + u_Ld * u_Kd * cos_angle, u_color.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, color, vertexShaderSource, fragmentShaderSource);
    this.ka = ka;
    this.kd = kd;
  }
}