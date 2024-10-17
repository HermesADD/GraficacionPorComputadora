window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";
  
  let vertexShaderSource =
  `#version 300 es

  in vec4 a_position;

  void main() {
    gl_PointSize = 5.0;

    gl_Position = a_position;
  }`;

  let fragmentShaderSource = 
  `#version 300 es
  precision mediump float;

  out vec4 pixelColor;

  void main() {
    pixelColor = vec4(1, 1, 1, 1);
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  let shapeVAO = gl.createVertexArray();
  gl.bindVertexArray(shapeVAO);

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let positions = [
    -0.5, -0.5, 0,
     0.5, -0.5, 0,
     0.5,  0.5, 0
  ];
  // Se crea una referencia al arreglo de posiciones en formato Float32, para realizar la actualización de las coordenadas de los vértices
  let f32_positions = new Float32Array(positions);
  // Al enviar la información al buffer de posiciones se utiliza "DYNAMIC_DRAW" en lugar de "STATIC_DRAW", para indicarle a WebGL que planeamos modificar los valores almacenados en este buffer
  gl.bufferData(gl.ARRAY_BUFFER, f32_positions, gl.DYNAMIC_DRAW);
 
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // Se crea un arreglo con las velocidades a las que se mueven los vértices
  let velocity = [
     0.1,  0.1, 0,
    -0.1,  0,   0,
    -0.1, -0.1, 0
  ];


  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);

  /**
   * 
   */
  // La variable delta acumula el tiempo que ha transcurrido (elapsed) entre cada iteración del ciclo de juego (gameLoop)
  let delta = 0;
  function update(elapsed) {
    delta += elapsed;

    // Se actualizan las posiciones de los vértices
    for (let i=0, l=f32_positions.length; i<l; i++) {
      // nueva posición = posición original + el tiempo transcurrido * la velocidad
      f32_positions[i] = positions[i] + delta*velocity[i];
    }

    // Se activa el buffer de datos que se quiere modificar, en este caso el buffer de posiciones
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Se envían los nuevos datos al buffer
    // No hay que olvidar que esta operación envía información almacenada en la RAM a la VRAM, por lo que puede ser costoso si se envía mucha información
    gl.bufferData(gl.ARRAY_BUFFER, f32_positions, gl.DYNAMIC_DRAW);
  }

  /**
   * 
   */
  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(shapeVAO);

    gl.drawArrays(gl.POINTS, 0, 3);

    gl.bindVertexArray(null);
  }


  /** Variables auxiliares para el ciclo de juego */
  let lastTime = Date.now();
  let current = 0;
  let elapsed = 0;
  let max_elapsed_wait = 30/1000;
  /**
   * Función que permite realizar un ciclo de juego
   */
  function gameLoop() {
    current = Date.now();
    elapsed = (current - lastTime) / 1000;
    lastTime = current;

    if (elapsed > max_elapsed_wait) {
      elapsed = max_elapsed_wait;
    }

    update(elapsed);
    draw();

    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
