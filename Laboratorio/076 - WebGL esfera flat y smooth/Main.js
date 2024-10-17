window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry_flat = [
    new Esfera_flat(
      gl, 
      2, // radio
      16, // Nu
      16, // Nv
      [1, 0.2, 0.3, 1], //color
      identity() // transformación
    ),
  ];

  let geometry_smooth = [
    new Esfera_smooth(
      gl, 
      2, // radio
      16, // Nu
      16, // Nv
      [1, 0.2, 0.3, 1], //color
      identity() // transformación
    ),
  ];


  let camera = new Camera(
    { x: 0, y: 7, z: 7 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }
  );

  let viewMatrix = camera.getMatrix();

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;


  // la posición de la luz en el espacio del mundo
  let lightPosition = { x: 0, y: 5, z: 5 };

  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  
  let radio_flat_shading = document.getElementById("flat_shading");
  let radio_smooth_shading = document.getElementById("smooth_shading");

  let shading_type = (radio_flat_shading.checked) ? "flat" : "smooth";

  radio_flat_shading.onchange = radio_smooth_shading.onchange =   function() {
    shading_type = (radio_flat_shading.checked) ? "flat" : "smooth";
    draw();
  };

  /**
   */
  function update(elapse) {
    if (shading_type == "flat") {
      for (let i=0; i<geometry_flat.length; i++) {
        geometry_flat[i].update(elapse);
      }
    } else {
      for (let i=0; i<geometry_smooth.length; i++) {
        geometry_smooth[i].update(elapse);
      }
    }
  }

  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (shading_type == "flat") {
      for (let i=0; i<geometry_flat.length; i++) {
        geometry_flat[i].draw(gl, projectionMatrix, viewMatrix, multiplyVector(viewMatrix, lightPosition));
      }
    } else {
      for (let i=0; i<geometry_smooth.length; i++) {
        geometry_smooth[i].draw(gl, projectionMatrix, viewMatrix, multiplyVector(viewMatrix, lightPosition));
      }
    }
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
