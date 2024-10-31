class PhongMaterial extends Material {
  constructor(gl, Ka=[0,0,0], Kd=[0,0,0], Ks=[0,0,0], shininess=1) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;
    out vec2 v_texcoord;

    void main() {
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );
      v_texcoord = vec2(a_texcoord.x, -a_texcoord.y); // se hace el flip de la coordenada Y

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;
    in vec2 v_texcoord;

    // Toda la información de la luz
    struct Light {
      vec3 position;
      vec3 La;
      vec3 Ld;
      vec3 Ls;
    };

    // Toda la información del material
    struct Material {
      sampler2D Ka_texture;
      sampler2D Kd_texture;
      sampler2D Ks_texture;
      sampler2D Ns_texture; // shininess
      int useNormalMap;
      sampler2D NormalMap;
    };

    // La luz se vuelve una instancia de la estructura Light
    uniform Light u_light;

    // El material se vuelve una instancia de la estructura Material
    uniform Material u_material;

    out vec4 pixelColor;

    vec3 getNormalFromMap() {
      vec3 tangentNormal = texture(u_material.NormalMap, v_texcoord).xyz * 2.0 - 1.0;
      vec3 Q1  = dFdx(v_position);
      vec3 Q2  = dFdy(v_position);
      vec2 st1 = dFdx(v_texcoord);
      vec2 st2 = dFdy(v_texcoord);
      vec3 N   = normalize(v_normal);
      vec3 T   = normalize(Q1*st2.t - Q2*st1.t);
      vec3 B   = -normalize(cross(N, T));
      mat3 TBN = mat3(T, B, N);
      return normalize(TBN * tangentNormal);
    }

    // Función que devuelve el componente ambiental
    vec3 ambiental(vec3 Ka) {
      return Ka*u_light.La;
    }

    // Función que devuelve el componente difuso
    vec3 difuso(vec3 L, vec3 N, vec3 Kd) {
      return Kd*u_light.Ld*max(dot(N, L), 0.0);
    }

    // Función que devuelve el componente especular
    vec3 especular(vec3 L, vec3 N, vec3 Ks, float shininess) {
      vec3 R = normalize( 2.0 * N * (dot(N, L)) - L );
      vec3 V = normalize( -v_position );

      return Ks*u_light.Ls*pow(max(dot(R, V), 0.0), shininess);
    }

    void main() {
      vec3 L = normalize( u_light.position - v_position );
      vec3 N = (u_material.useNormalMap > 0) ? getNormalFromMap() : normalize( v_normal );

      vec3 Ka = texture(u_material.Ka_texture, v_texcoord).rgb;
      vec3 Kd = texture(u_material.Kd_texture, v_texcoord).rgb;
      vec3 Ks = texture(u_material.Ks_texture, v_texcoord).rgb;
      // el valor máximo de shininess es 255, se pueden usar las demás componentes de la textura para codificar un rango de valores mayores
      float shininess = 255.0 * texture(u_material.Ns_texture, v_texcoord).r; 

      vec3 ambient_color = ambiental(Ka);
      vec3 diffuse_color = difuso(L, N, Kd);
      vec3 specular_color = especular(L, N, Ks, shininess);

      pixelColor = vec4(ambient_color + diffuse_color + specular_color, 1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.Ka = Ka;
    this.Kd = Kd;
    this.Ks = Ks;
    this.shininess = shininess;
  }
}