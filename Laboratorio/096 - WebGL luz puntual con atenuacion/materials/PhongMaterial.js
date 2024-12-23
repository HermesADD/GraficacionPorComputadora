class PhongMaterial extends Material {
  constructor(gl, Ka=[0,0,0], Kd=[0,0,0], Ks=[0,0,0], shininess=1) {
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

    // Toda la información de la luz
    struct Light {
      vec3 position;
      vec3 La;
      vec3 Ld;
      vec3 Ls;
      float quadratic;  // a
      float linear;     // b
      float constant;   // c
    };

    // Toda la información del material
    struct Material {
      vec3 Ka;
      vec3 Kd;
      vec3 Ks;
      float shininess;
    };

    uniform Light u_light;
    uniform Material u_material;

    out vec4 pixelColor;

    // Función que devuelve el componente ambiental
    vec3 ambiental() {
      return u_material.Ka * u_light.La;
    }

    // Función que devuelve el componente difuso
    vec3 difuso(vec3 L, vec3 N) {
      return u_material.Kd * u_light.Ld * max(dot(N, L), 0.0);
    }

    // Función que devuelve el componente especular
    vec3 especular(vec3 L, vec3 N) {
      vec3 R = normalize( 2.0 * N * (dot(N, L)) - L );
      vec3 V = normalize( vec3(0,0,0) - v_position );

      return u_material.Ks * u_light.Ls * pow(max(dot(R, V), 0.0), u_material.shininess);
    }

    void main() {
      vec3 L = normalize( u_light.position - v_position );
      vec3 N = normalize( v_normal );

      vec3 ambient_color = ambiental();
      vec3 diffuse_color = difuso(L, N);
      vec3 specular_color = especular(L, N);

      // La distancia de la posición de la luz a la posición del fragmento
      float d = length( u_light.position - v_position );
      // El factor de atenuación utilizando la distancia (d), el factor cuadrático (a), lineal (b) y constante (c)
      float attenuation = 1.0/(u_light.quadratic * d * d + u_light.linear * d + u_light.constant);

      // La atenuación afecta a los componentes difuso y especular solamente
      pixelColor = vec4(ambient_color + attenuation*(diffuse_color + specular_color), 1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.Ka = Ka;
    this.Kd = Kd;
    this.Ks = Ks;
    this.shininess = shininess;
  }
}