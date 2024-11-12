class PhongMaterial extends Material {
  constructor(gl, Ka=[0,0,0], Kd=[0,0,0], Ks=[0,0,0], shininess=1, color=[1,1,1,1]) {
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
    };

    // Toda la información del material
    struct Material {
      vec3 Ka;
      vec3 Kd;
      vec3 Ks;
      float shininess;
      vec4 color;
    };

    // La luz se vuelve un arreglo de la estructura Light; es importante indicar el número de luces que se van a utilizar, en este caso 3
    uniform Light u_light[3];

    uniform Material u_material;

    out vec4 pixelColor;

    // Función que devuelve el componente ambiental
    vec3 ambiental(Light light) {
      return u_material.Ka * light.La;
    }

    // Función que devuelve el componente difuso
    vec3 difuso(vec3 L, vec3 N, Light light) {
      return u_material.Kd * light.Ld * max(dot(N, L), 0.0);
    }

    // Función que devuelve el componente especular
    vec3 especular(vec3 L, vec3 N, Light light) {
      vec3 R = normalize( 2.0 * N * (dot(N, L)) - L );
      vec3 V = normalize( -v_position );

      return u_material.Ks * light.Ls * pow(max(dot(R, V), 0.0), u_material.shininess);
    }

    void main() {
      vec3 N = normalize( v_normal );

      vec3 ambient_color = vec3(0);
      vec3 diffuse_color = vec3(0);
      vec3 specular_color = vec3(0);

      for (int i=0; i<3; i++) {
        vec3 L = normalize( u_light[i].position - v_position );

        ambient_color += ambiental(u_light[i]);
        diffuse_color += difuso(L, N, u_light[i]);
        specular_color += especular(L, N, u_light[i]);
      }

      pixelColor = vec4(ambient_color + vec3(u_material.color)*diffuse_color + specular_color, u_material.color.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, color, vertexShaderSource, fragmentShaderSource);

    this.Ka = Ka;
    this.Kd = Kd;
    this.Ks = Ks;
    this.shininess = shininess;

  }
}