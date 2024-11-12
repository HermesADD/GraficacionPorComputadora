class WireframeMaterial extends Material {
  constructor(gl, color=[1,1,1,1]) {
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_barycentric;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_barycentric;

    void main() {
      v_barycentric = a_barycentric;
      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_barycentric;

    out vec4 pixelColor;

    void main() {
      vec3 bary = v_barycentric;
      vec3 color = vec3(0);
      float border_alpha = 1.0;

      // Mitad del ancho de la línea, ya que la esta se dibuja en el interior de un triángulo y la otra mitad en los triángulos adyacentes
      float width = 0.5;

      // La función fwidth calcula la variación de las coordenadas baricéntricas en un fragmento, que se usa para el grosor de la línea en píxeles
      vec3 d = fwidth(v_barycentric);

      // Se realiza una transición gradual entre el color del borde y el de la superficie
      vec3 s = smoothstep(d * (width + 0.5), d * (width - 0.5), v_barycentric);

      // Entre más cerca este el fragmento al borde los valores de s.x, s.y o s.z estarán más cerca de 1, lo que significa que deben dibujarse
      border_alpha *= max(max(s.x, s.y), s.z);

      pixelColor = vec4(color, border_alpha);
    }`;

    // Se llama al constructor de la clase Material
    super(gl, color, vertexShaderSource, fragmentShaderSource);

  }
}