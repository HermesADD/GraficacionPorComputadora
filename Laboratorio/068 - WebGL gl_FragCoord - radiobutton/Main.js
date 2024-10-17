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

    dist = mix(dist_step, dist_smoothstep, u_UseSmoothstep);

    pixelColor = vec4(dist, dist, dist, 1);
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  let windowSizeUniformLocation = gl.getUniformLocation(program, "u_WindowSize");

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

  // Se obtiene una referencia al radio botón que controla si se usa el valor de step
  let radio_step = document.getElementById("use_step");

  // Se obtiene una referencia al radio botón que controla si se usa el valor de smoothstep
  let radio_smoothstep = document.getElementById("use_smoothstep");

  // Se inicia una variable que tendrá el valor del radio botón seleccionado
  let useSmoothstepVal = (radio_smoothstep.checked) ? 1 : 0;

  // Se crea un manejador de eventos asociado al radio botón para usar el valor de step
  radio_step.addEventListener("change", function() {
    useSmoothstepVal = (radio_step.checked) ? 0 : 1;
    draw();
  });

  // Se crea un manejador de eventos asociado al radio botón para usar el valor de smoothstep
  radio_smoothstep.addEventListener("change", function() {
    useSmoothstepVal = (radio_smoothstep.checked) ? 1 : 0;
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
