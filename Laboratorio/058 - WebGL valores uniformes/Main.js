window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";
  
  let vertexShaderSource =
  `#version 300 es

  in vec4 a_position;
   
  void main() {
    gl_Position = a_position;
  }`;

  let fragmentShaderSource = 
  `#version 300 es
  precision mediump float;

  // el modificador "uniform" indica que la variable "u_color" es un valor único durante la ejecución de un ciclo de dibujado, es decir, es el mismo valor para todos los elementos que se procesan
  uniform vec4 u_color;

  out vec4 pixelColor;

  void main() {
    // en los ejemplos anteriores el color era un color fijado en el código del shader; ahora el color se recibe desde un valor uniforme enviado desde JavaScript antes de la ejecución de la función de dibujado
    pixelColor = u_color;
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // se obtiene una referencia a la variable uniforme "u_color"
  let colorUniformLocation = gl.getUniformLocation(program, "u_color");

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  let shapeVAO = gl.createVertexArray();
  gl.bindVertexArray(shapeVAO);

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let positions = [
    // triángulo 1
    -0.5, -0.5, 0,
     0.5, -0.5, 0,
     0.5,  0.5, 0,

    // triángulo 2
     0.5,  0.5, 0,
    -0.5,  0.5, 0,
    -0.5, -0.5, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
 
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);

  /**
   * 
   */
  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(shapeVAO);

    // Se envía a la variable "u_color" el valor de (1, 0, 0, 1), es decir, un color rojo
    // Hay una familia de funciones del tipo uniformNT, donde N es el número de valores que se envía y T es el tipo del valor, en este caso enviamos 4 valores de tipo flotante 
    gl.uniform4f(colorUniformLocation, 2, 0, 1 , 1);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindVertexArray(null);
  }

  draw();

});
