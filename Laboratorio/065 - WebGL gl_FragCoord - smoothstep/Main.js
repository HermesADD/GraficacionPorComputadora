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
    vec2 c = ((gl_FragCoord.xy / u_WindowSize) - 0.5) * 2.0;

    float dist = length(c);

    // La función smoothstep(edge0, edge1, val); es similar a step pero generando un interpolación suave cuando val se encuentra en en intervalo [edge0, edge1], y devuelve 0 si val < edge0; y devuelve 1 si val >= edge1
    // Con esto se vuelve 0 cualquier valor menor que 0.5 y se vuelve 1 con cualquier valor mayor 0.7, generando un interpolación suave para los valores dentro del intervalo [0.5, 0.7]
    dist = smoothstep(0.5, 0.7, dist);

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
