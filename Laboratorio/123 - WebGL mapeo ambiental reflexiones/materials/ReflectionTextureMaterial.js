class ReflectionTextureMaterial extends Material {
  constructor(gl, x_p, x_n, y_p, y_n, z_p, z_n) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_reflection_dir;

    void main() {
      vec4 transformed_normal = u_VM_matrix * vec4(a_normal, 0);
      vec4 position = u_VM_matrix * a_position;

      // la función reflect calcula un vector similar al vector R que vimos en el modelo de iluminación de Phong, es decir, R = 2(N ⋅ V) N - V
      // en este caso reflect(I, N) calcula I - 2(N · I) N; el primer argumento I es un vector de dirección de incidencia y el segundo es la normal
      v_reflection_dir = reflect(normalize(position.xyz), normalize(transformed_normal.xyz));

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    // El vector de reflexión se utiliza para acceder a la textura cúbica
    in vec3 v_reflection_dir;

    uniform samplerCube u_texture;

    out vec4 pixelColor;

    void main() {
      pixelColor = texture(u_texture, v_reflection_dir);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    ////////////////////////////////////////////////////////////////////
    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, x_p);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, x_n);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, y_p);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, y_n);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, z_p);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, z_n);

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

    this.isCubeMap = true;
  }
}