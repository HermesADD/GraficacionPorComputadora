class BorderMaterial extends Material {
  constructor(gl, color=[1,1,1,1]) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_PVM_matrix;

    // Ancho del borde, este valor puede ser obtenido desde un uniforme en caso de querer un borde de tamaño variable por objeto geométrico
    float thickness = 0.05;

    void main() {
      // La posición de los vértices del objeto se traslada en dirección de la normal multiplicada por el tamaño del borde (thickness)
      gl_Position = u_PVM_matrix * vec4((a_position.xyz + normalize(a_normal)*thickness), 1);
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      pixelColor = u_color;
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    this.color = color;
  }
}