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

  uniform vec2 u_WindowSize;

  out vec4 pixelColor;

  void main() {
    // Las coordenadas se normalizan para estar en el intervalo [0, 1]
    vec2 c = gl_FragCoord.xy / u_WindowSize;
    // Las coordenadas se recorren para que estén en el intervalo [-0.5, 0.5], lo que hace que se centren en la pantalla
    c = c - 0.5;
    // Por último las coordenadas se escalan para que estén en el intervalo [-1, 1]
    c = c * 2.0;

    // La función length devuelve la distancia que hay desde el origen hasta la posición de la coordenada que recibe como parámetro, en este caso devuelve la distancia de la coordenada del fragmento que se modifico para estar en el intervalo [-1, 1]
    float dist = length(c);

    // El color final es un color gris que corresponde a la distancia, lo que dibuja un círculo degradado centrado en el canvas
    pixelColor = vec4(dist, dist, dist, 1);
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

    gl.uniform2f(windowSizeUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(shapeVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  draw();
});
