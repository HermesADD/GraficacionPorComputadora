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
  uniform float u_UseSmoothstep;

  out vec4 pixelColor;

  void main() {
    vec2 c = ((gl_FragCoord.xy / u_WindowSize) - 0.5) * 2.0;

    float dist = length(c);

    float dist_step = step(0.5, dist);
    float dist_smoothstep = smoothstep(0.5, 0.7, dist);

    // Se utiliza el valor del uniforme u_UseSmoothstep para determinar que valor se utiliza y como se dibuja el círculo
    dist = mix(dist_step, dist_smoothstep, u_UseSmoothstep);

    pixelColor = vec4(dist, dist, dist, 1);
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  let windowSizeUniformLocation = gl.getUniformLocation(program, "u_WindowSize");

  // Se crea una referencia al uniforme para decidir que valor usar, si el valor obtenido con step o con smoothstep
  let useSmoothstepUniformLocation = gl.getUniformLocation(program, "u_UseSmoothstep");

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

  // Se obtiene una referencia al checkbox que controla si se usa el valor de step o de smoothstep
  let checkbox = document.getElementById("use_smoothstep_ck");

  // Se inicia una variable que tendrá el valor del checkbox, convertido de booleano (true, false) a un número (1, 0)
  let useSmoothstepVal = (checkbox.checked) ? 1 : 0;

  // Se crea un manejador de eventos asociado al checkbox para que cuando cambie su valor se actualice el valor de la variable useSmoothstepVal y se realice un redibujado del canvas
  checkbox.addEventListener("change", function() {
    useSmoothstepVal = (checkbox.checked) ? 1 : 0;
    draw();
  });



  /**
   * 
   */
  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(windowSizeUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.uniform1f(useSmoothstepUniformLocation, useSmoothstepVal);

    gl.bindVertexArray(shapeVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  draw();

});
