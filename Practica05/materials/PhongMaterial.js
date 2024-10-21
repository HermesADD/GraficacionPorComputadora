class PhongMaterial extends Material{
  constructor(gl, Ka=[0,0,0], Kd=[0,0,0],Ks=[0,0,0], shininess=1){
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

    // color ambiental de la luz
    uniform vec3 u_La;

    // coeficiente de reflexión ambiental del material
    uniform vec3 u_Ka;

    // color difuso de la luz
    uniform vec3 u_Ld;

    // coeficiente de reflexión difusa del material
    // el color del material
    uniform vec3 u_Kd;

    // color especular de la luz
    uniform vec3 u_Ls;

    // coeficiente de reflexión especular del material
    uniform vec3 u_Ks;

    // intensidad del brillo especular del material
    uniform float u_shininess;

    out vec4 pixelColor;

    // Función que devuelve el componente ambiental
    vec3 ambiental() {
      return u_Ka * u_La;
    }

    // Función que devuelve el componente difuso
    vec3 difuso(vec3 L, vec3 N) {
      // El coseno del ángulo entre la dirección de la luz y la normal del fragmento
      float cos_theta = max(dot(N, L), 0.0);

      return u_Kd*u_Ld*cos_theta;
    }

    // Función que devuelve el componente especular
    vec3 especular(vec3 L, vec3 N) {
      // Vector de reflexión de la luz
      vec3 R = normalize( 2.0 * N * (dot(N, L)) - L );

      // Vector de la vista
      // como las operaciones se hacen en el espacio de la vista, la cámara esta en el origen, por lo que el vector de la vista es simplemente la dirección que hay de la posición del fragmento hacia el origen
      vec3 V = normalize( vec3(0,0,0) - v_position );

      // El coseno del ángulo entre la dirección de la luz y la normal del fragmento
      float cos_phi = max(dot(R, V), 0.0);
      cos_phi = pow(cos_phi, u_shininess);

      return u_Ks*u_Ls*cos_phi;
    }

    void main() {
      // El vector de dirección de la luz hacia el fragmento
      vec3 L = normalize( u_light_position - v_position );

      // La normal del fragmento
      vec3 N = normalize( v_normal );

      vec3 ambient_color = ambiental();
      vec3 diffuse_color = difuso(L, N);
      vec3 specular_color = especular(L, N);

      pixelColor = vec4(ambient_color + diffuse_color + specular_color, 1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Se almacena el coeficiente de reflexión ambiental
    this.Ka = Ka;

    // Se almacena el coeficiente de reflexión difusa
    this.Kd = Kd;

    // Se almacena el coeficiente de reflexión especular
    this.Ks = Ks;

    // Se almacena la intensidad del coeficiente especular
    this.shininess = shininess;
  }


  
}