class AmbientDiffuseMaterial extends Material {
  constructor(gl, Ka = [0, 0, 0], Kd = [0, 0, 0]) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;

    void main() {
      v_position = vec3(u_VM_matrix * a_position);
      v_normal = vec3(u_VM_matrix * vec4(a_normal, 0));

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;

    // color ambiental de la luz
    uniform vec3 u_La;

    // coeficiente de reflexión ambiental del material
    uniform vec3 u_Ka;

    // color difuso de la luz
    uniform vec3 u_Ld;

    // coeficiente de reflexión difusa del material
    // el color del material
    uniform vec3 u_Kd;

    out vec4 pixelColor;

    // Función que devuelve el componente ambiental
    vec3 ambiental() {
      return u_Ka * u_La;
    }

    // Función que devuelve el componente difuso
    vec3 difuso(vec3 L, vec3 N) {
      float cos_theta = max(dot(N, L), 0.0);
      return u_Kd * u_Ld * cos_theta;
    }

    void main() {
      // Vector de dirección de la luz hacia el fragmento
      vec3 L = normalize(vec3(0.0, 5.0, 0.0) - v_position); // Asumiendo una luz en (0, 5, 0)

      // La normal del fragmento
      vec3 N = normalize(v_normal);

      vec3 ambient_color = ambiental();
      vec3 diffuse_color = difuso(L, N);

      pixelColor = vec4(ambient_color + diffuse_color, 1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Se almacena el coeficiente de reflexión ambiental
    this.Ka = Ka;

    // Se almacena el coeficiente de reflexión difusa
    this.Kd = Kd;
  }
}
