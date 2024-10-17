window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";
  
  let vertexShaderSource =
  `#version 300 es

  in vec4 a_position;

  // atributo para el color de cada vértice, esta variable recibe valores desde un buffer de datos, similar a la variable "a_position"
  in vec4 a_color;


  // variable de salida que permite comunicar el shader de vértices con el de fragmentos, para utilizar esta variable en el shader de fragmentos hay que definir una variable con el mismo tipo y nombre pero con el modificado "in"
  // los valores de esta variable al pasar al shader de fragmentos serán interpolados para cada pixel que se va a dibujar
  out vec4 v_color;
   
  void main() {
    // se asigna un valor a la variable de comunicación con el shader de fragmentos
    v_color = a_color;

    gl_Position = a_position;
  }`;

  let fragmentShaderSource = 
  `#version 300 es
  precision mediump float;

  // variable recibida desde el shader de vértices; los valores que recibe esta variable son valores interpolados para cada pixel que se va a dibujar
  in vec4 v_color;

  out vec4 pixelColor;

  void main() {
    pixelColor = v_color;
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // se obtiene una referencia al atributo "a_color"
  let colorAttributeLocation = gl.getAttribLocation(program, "a_color");

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

  // Se crea el buffer de datos para los colores, estos colores están asociados a los vértices de la geometría, por lo se debe definir un color para los 6 vértices de la geometría
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  let colors = [
    // triángulo 1, 
    1, 0, 0, // color rojo
    0, 1, 0, // color verde
    0, 0, 1, // color azul

    // triángulo 1, color amarillo
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Igual que antes se activa la referencia a la variable del shader, para decirle como va a tomar los valores del buffer de datos
  gl.enableVertexAttribArray(colorAttributeLocation);

  size = 3;
  type = gl.UNSIGNED_BYTE;
  normalize = true;
  stride = 0;
  offset = 0;
  gl.vertexAttribPointer(
    colorAttributeLocation, 
    3, // se toman elementos de 3 en 3
    gl.FLOAT, // el tipo de dato es flotante
    false, // no se normaliza
    0, // no se consideran espacios entre los datos
    0  // inicia en el primer elemento
  );


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

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindVertexArray(null);
  }

  draw();

});
