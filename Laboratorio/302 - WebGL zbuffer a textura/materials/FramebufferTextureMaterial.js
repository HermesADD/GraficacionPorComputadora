class FramebufferTextureMaterial extends Material {
  constructor(gl) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec2 a_texcoord;

    out vec2 v_texcoord;

    uniform mat4 u_PVM_matrix;

    void main() {
      v_texcoord = a_texcoord;
      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec2 v_texcoord;

    uniform sampler2D u_texture;

    out vec4 pixelColor;

    void main() {
      float depthValue = texture(u_texture, v_texcoord).r;
      //pixelColor = vec4( vec3(depthValue), 1.0 );

      // Para visualizar la profundidad es necesario ajustar el intervalo de valores, ya que la textura esta creada con una textura de valores flotantes de 32 bits
      // este ajuste no es necesario cuando simplemente se usan los valores de profundidad, por ejemplo, para el cálculo de sombras
      float n = 0.1;  // el mismo que se uso en la matriz de proyección
      float f = 20.0; // el mismo que se uso en la matriz de proyección
      float grey = (2.0 * n) / (f + n - depthValue*(f - n));
      pixelColor = vec4( vec3(grey), 1.0 );
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);

  }
}