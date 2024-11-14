class SimpleMaterial extends Material {
  constructor(gl) {
    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;

    uniform mat4 u_PVM_matrix;

    void main() {
      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    out vec4 pixelColor;

    void main() {
      pixelColor = vec4(0.0,0.0,0.0,1.0);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);
  }
}