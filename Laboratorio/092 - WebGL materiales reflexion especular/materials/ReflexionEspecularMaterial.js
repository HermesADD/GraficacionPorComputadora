class ReflexionEspecularMaterial extends Material {
  constructor(gl, Ks=[0,0,0], shininess=1, color=[1,1,1,1]) {
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

    // color especular de la luz
    uniform vec3 u_Ls;

    // coeficiente de reflexión especular del material
    uniform vec3 u_Ks;

    // intensidad del brillo especular del material
    uniform float u_shininess;

    // color del material
    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      // El vector de dirección de la luz hacia el fragmento
      vec3 L = normalize( u_light_position - v_position );

      // La normal del fragmento
      vec3 N = normalize( v_normal );

      // Vector de reflexión de la luz
      vec3 R = normalize( 2.0 * N * (dot(N, L)) - L );

      // Vector de la vista
      // como las operaciones se hacen en el espacio de la vista, la cámara esta en el origen, por lo que el vector de la vista es simplemente la dirección que hay de la posición del fragmento hacia el origen
      vec3 V = normalize( vec3(0,0,0) - v_position );

      // El coseno del ángulo entre la dirección de la luz y la normal del fragmento
      float cos_phi = max(dot(R, V), 0.0);
      cos_phi = pow(cos_phi, u_shininess);

      pixelColor = vec4(u_Ks*u_Ls*cos_phi, u_color.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Se almacena el coeficiente de reflexión especular
    this.Ks = Ks;

    // Se almacenan las intensidades del coeficiente especular del material
    this.shininess = shininess;

    this.color = color;
  }
}