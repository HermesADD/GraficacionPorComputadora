window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";
  
  let vertexShaderSource =
  `#version 300 es

  in vec4 a_position;

  // la información que pueden recibir los shader puede ser cualquier información que sea importante, en este caso se recibe un vector de dirección que determina la velocidad a la que se mueve un vértice; esta información se obtiene de un buffer de datos
  in vec3 a_velocity;

  // para realizar una animación desde el shader, en la aplicación (código JavaScript) se obtiene el tiempo que ha transcurrido y este valor se le comunica a WebGL por medio de una variable uniforme
  uniform float u_delta;

  void main() {
    gl_PointSize = 5.0;

    // la variable gl_Position es de tipo vec4 y necesita la posición de un vértice en coordenadas homogéneas, lo ideal es no modificar directamente la componente w ya que esta tiene información para la transformación de perspectiva, por esto se obtienen las coordenadas xyz de a_position y de a_velocity y con ellas se construye un vec4
    gl_Position = vec4( a_position.xyz + u_delta*(a_velocity.xyz), 1);
  }`;

  let fragmentShaderSource = 
  `#version 300 es
  precision mediump float;

  out vec4 pixelColor;

  void main() {
    pixelColor = vec4(1, 1, 1, 1);
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Referencia al valor uniforme para el tiempo
  let deltaUniformLocation = gl.getUniformLocation(program, "u_delta");


  // Se obtiene una referencia al atributo "a_velocity"
  let velocityAttributeLocation = gl.getAttribLocation(program, "a_velocity");

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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
 
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // Se crea el buffer de datos para las velocidades, estas velocidades están asociados a los vértices de la geometría, por lo se debe definir una velocidad para todos los vértices de la geometría
  let velocityBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
  let velocity = [
     0.1,  0.1, 0,
    -0.1,  0,   0,
    -0.1, -0.1, 0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(velocity), gl.STATIC_DRAW);

  // Igual que antes se activa la referencia a la variable del shader, para decirle como va a tomar los valores del buffer de datos
  gl.enableVertexAttribArray(velocityAttributeLocation);
  gl.vertexAttribPointer(velocityAttributeLocation, 3, gl.FLOAT, false, 0, 0);


  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);

  /**
   * 
   */
  // La variable delta acumula el tiempo que ha transcurrido (elapsed) entre cada iteración del ciclo de juego (gameLoop) y esta variable es la que se envía a los shaders
  let delta = 0;
  function update(elapsed) {
    delta += elapsed;
  }

  /**
   * 
   */
  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // Se envía el valor del tiempo transcurrido a los shaders
    gl.uniform1f(deltaUniformLocation, delta);

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
