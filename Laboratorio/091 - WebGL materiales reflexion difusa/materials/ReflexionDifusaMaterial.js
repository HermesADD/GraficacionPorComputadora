class ReflexionDifusaMaterial extends Material {
  constructor(gl, Kd=[0,0,0], color=[1,1,1,1]) {
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

    // posición de una luz
    uniform vec3 u_light_position;

    // color difuso de la luz
    uniform vec3 u_Ld;

    // coeficiente de reflexión difusa del material
    uniform vec3 u_Kd;

    // color del material
    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      // El vector de dirección de la luz hacia el fragmento
      vec3 L = normalize( u_light_position - v_position );

      // La normal del fragmento
      vec3 N = normalize(v_normal);

      // El coseno del ángulo entre la dirección de la luz y la normal del fragmento
      float cos_theta = max(dot(N, L), 0.0);

      pixelColor = vec4(u_Kd*u_Ld*cos_theta, u_color.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Se almacenan los coeficientes de reflexión difusa del material
    this.Kd = Kd;

    this.color = color;
  }
}