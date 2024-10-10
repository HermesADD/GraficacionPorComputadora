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

  // El tamaño del área de dibujo (el canvas)
  uniform vec2 u_WindowSize;

  out vec4 pixelColor;

  // gl_FragCoord es una variable que contiene la información de la coordenada relativa al área de dibujo del fragmento que se esta procesando
  // Como se esta dibujando un rectángulo (dos triángulos) que cubren todo el canvas, gl_FragCoord.x va de 0 al ancho del canvas; gl_FragCoord.y va de 0 al alto del canvas 

  void main() {
    // Se divide entre el tamaño de la ventana, esta única operación es equivalente a dos divisiones gl_FragCoord.x / u_WindowSize.x; y gl_FragCoord.y / u_WindowSize.y
    // Con esto se obtienen valores que van de 0 a 1
    vec2 c = gl_FragCoord.xy / u_WindowSize;
    
    // Los valores normalizados de las coordenadas se utilizan como componentes de color, lo que da el gradiente que se observa en la imagen
    pixelColor = vec4(c.x, c.y, 0, 1);
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  let windowSizeUniformLocation = gl.getUniformLocation(program, "u_WindowSize");

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");


  let shapeVAO = gl.createVertexArray();
  gl.bindVertexArray(shapeVAO);

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let positions = [
    // triángulo 1
    -1, -1, 0,
    -1,  1, 0,
     1, -1, 0,

    // triángulo 2
    -1,  1, 0,
     1,  1, 0,
     1, -1, 0,
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

    // Se envía el tamaño del canvas al shader como dos valores flotantes
    gl.uniform2f(windowSizeUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(shapeVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  draw();
});
