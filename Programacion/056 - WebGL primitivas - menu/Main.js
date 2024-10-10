window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";
  
  let vertexShaderSource =
  `#version 300 es

  in vec4 a_position;
   
  void main() {
    // el tamaño en píxeles del punto
    gl_PointSize = 5.0;

    gl_Position = a_position;
  }`;

  let fragmentShaderSource = 
  `#version 300 es
  precision mediump float;

  out vec4 pixelColor;

  void main() {
    // color blanco para los píxeles
    pixelColor = vec4(1, 1, 1, 1);
  }`;

  // La función createProgram se encuentra en Utils.js y se encarga de crear un programa con el código fuente de los shaders que se le pasan
  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);


  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  let shapeVAO = gl.createVertexArray();
  gl.bindVertexArray(shapeVAO);

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let positions = [
    -0.5, -0.5, 0,
     0.5, -0.5, 0,
     0.5,  0.5, 0,
    -0.5,  0.5, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
 
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);

  // Variable auxiliar que tendrá el valor de la primitiva que se utilizará para dibujar los mismos 4 puntos en el mismo buffer de datos
  let primitive_type = gl.POINTS;

  /**
   * 
   */
  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(shapeVAO);

    // Se dibuja el VAO utilizando la primitiva seleccionada
    gl.drawArrays(primitive_type, 0, 4);

    gl.bindVertexArray(null);
  }

  draw();

  // Referencia al menú para seleccionar el tipo de primitiva
  let menu_primitiva = document.getElementById("menu_primitiva");

  // Se obliga a que siempre que se cargue la página el menú tenga seleccionada la primera opción (0)
  menu_primitiva.value = 0;

  // Evento de cambio ("change") del menú
  menu_primitiva.onchange = function(evt) {
    // Dependiendo el valor del menú se selecciona el tipo de primitiva; el valor que contiene el menú es una cadena
    switch(parseInt(menu_primitiva.value)) {
      case 0:
        primitive_type = gl.POINTS;
        break;
      case 1:
        primitive_type = gl.LINES;
        break;
      case 2:
        primitive_type = gl.LINE_STRIP;
        break;
      case 3:
        primitive_type = gl.LINE_LOOP;
        break;
      case 4:
        primitive_type = gl.TRIANGLE_STRIP;
        break;
      case 5:
        primitive_type = gl.TRIANGLE_FAN;
        break;
      case 6:
        primitive_type = gl.TRIANGLES;
        break;
    }

    // Una vez que se cambio la primitiva, se dibuja de nuevo
    draw();
  };


});
