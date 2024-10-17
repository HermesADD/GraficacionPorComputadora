class ReflexionAmbientalMaterial extends Material {
  constructor(gl, Ka=[0,0,0], color=[1,1,1,1]) {
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

    // color de la luz ambiental
    uniform vec3 u_La;

    // coeficiente de reflexión ambiental del material
    uniform vec3 u_Ka;

    // color del material
    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      pixelColor = vec4(u_Ka * u_La, u_color.a);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, vertexShaderSource, fragmentShaderSource);

    // Se almacenan los coeficientes de reflexión ambiental del material
    this.Ka = Ka;

    this.color = color;
  }
}