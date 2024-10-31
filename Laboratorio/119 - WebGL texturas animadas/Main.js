// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  // En webgl las imágenes se encuentran reflejadas respecto al eje Y, por lo que para usarlas directamente es necesario indicarle que les de la vuelta
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  ////////////////////////////////////////////////////
  let textura1 = await loadImage("textura1.png");
  let textura2 = await loadImage("textura2.png");
  let textura3 = await loadImage("textura3.png");

  ////////////////////////////////////////////////////
  let geometry = [
    new PlanoParametrico(
      gl,
      10,
      10,
      160,
      160,
      new MultipleAnimatedTextureMaterial( gl, textura1, textura2, textura3 ),
      translate(0, 0, 0),
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:8, z:12 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let light = new LuzPuntual(
    { x: 5, y: 5, z: 5 }, // posición
    [ 0.2, 0.2, 0.2 ],    // component ambiental
    [ 1, 1, 1 ],          // componente difuso
    [ 1, 1, 1 ]           // componente especular
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  let delta = 0;
  function update(elapsed) {
    delta += elapsed;
  }

  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        light,
        delta
      );
    }
  }

  draw();

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

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
