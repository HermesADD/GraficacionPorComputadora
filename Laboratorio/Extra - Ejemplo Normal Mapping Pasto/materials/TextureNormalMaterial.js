class TextureNormalMaterial extends Material {
  constructor(gl, text_colors, tex_normals) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec2 a_texcoord;
    in vec3 a_normal;
    in vec3 a_tangent;
    in vec3 a_bitangent;

    uniform mat4 u_M_matrix;
    uniform mat4 u_PVM_matrix;
    uniform vec3 u_light_position;

    out vec2 v_texcoord;
    out vec3 v_tangent_light_pos;

    void main() {
      // Se multiplican los vectores normal, tangente y bitangente por la transformación del modelo
      vec3 N = normalize(vec3(u_M_matrix * vec4(a_normal, 0.0)));
      vec3 T = normalize(vec3(u_M_matrix * vec4(a_tangent, 0.0)));
      vec3 B = normalize(vec3(u_M_matrix * vec4(a_bitangent, 0.0)));

      // otra forma de obtener el vector bitangente es por medio del producto cruz entre la normal y la tangente; aunque de esta forma el calculo se realiza en cada vértice que se procese
      //vec3 B = cross(N, T);

      // Se construye una matriz de transformación (cambio de base), con los vectores normal, tangente y bitangente
      mat3 TBN = mat3(
        T.x, B.x, N.x,
        T.y, B.y, N.y,
        T.z, B.z, N.z
      );
      // Se obtiene la dirección de la luz (L) a partir de la posición de los vértices en el espacio del mundo (transformación del modelo); esto nos devuelve la dirección de la luz en el espacio del mundo
      v_tangent_light_pos = TBN * (u_light_position - vec3(u_M_matrix * a_position));

      // Las coordenadas de textura interpoladas
      v_texcoord = a_texcoord;

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    // Valor interpolado de las coordenadas de textura, obtenido desde el shader de vértices
    in vec2 v_texcoord;

    // Valor interpolado de la dirección de luz en el espacio del mundo
    in vec3 v_tangent_light_pos;

    // Las texturas
    uniform sampler2D u_texture;
    uniform sampler2D u_texture_normal;

    out vec4 pixelColor;

    void main() {
      // En este ejemplo se realiza una iluminación difusa
      // En el caso de implementar el modelo de Phong, es necesario enviar por medio de un uniform la posición de la cámara para calcular correctamente el vector de reflexión R; o realizar el calculo de la posición de la luz respecto a la tangente en el espacio de la cámara

      vec3 L = normalize( v_tangent_light_pos );

      // Se extrae la normal del mapa de normales
      vec3 N = texture(u_texture_normal, v_texcoord).rgb;

      // Como las imágenes tienen valores que van de 0 a 1, y las normales tienen valores que van de -1 a 1, se multiplica la normal obtenida por 2 para tener un rango de [0, 2] y luego se le resta 1 para obtener el rango deseado [-1, 1]
      N = normalize(N * 2.0 - 1.0);

      // El factor difuso del objeto
      float cos_angle = max(dot(N, L), 0.0);

      // Se utiliza el color de la textura y el factor difuso para colorear la superficie del objeto
      pixelColor = vec4(vec3(texture(u_texture, v_texcoord)) * cos_angle, 1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);

    ////////////////////////////////////////////////////////////////////
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0); // se asigna a la unidad 0 de texturas
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, text_colors);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.normal_texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1); // se asigna a la unidad 1 de texturas
    gl.bindTexture(gl.TEXTURE_2D, this.normal_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex_normals);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

  }
}