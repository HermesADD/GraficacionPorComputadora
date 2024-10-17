window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Suzanne(
      gl, 
      new DiffuseMaterial(gl, [243/255, 156/255, 18/255, 1]), // material
      identity() // transformación
    ),
    new Esfera(
      gl, 
      2, // radio
      16, // Nu
      16, // Nv
      new FlatMaterial(gl, [22/255, 160/255, 133/255, 1]), // material
      translate(-6, 0, 0) // transformación
    ),
    new Teapot(
      gl, 
      new DiffuseMaterial(gl, [52/255, 152/255, 219/255, 1]), // material
      translate(6, 0, 0) // transformación
    ),
    new PrismaRectangular(
      gl, 
      4, //w
      4, //h
      4, //l
      new DiffuseMaterial(gl, [1, 0.2, 0.3, 1]), // material
      translate(0, 6, 0) // transformación
    ),
    new Engrane(
      gl, 
      new DiffuseMaterial(gl, [241/255, 196/255, 15/255, 1]), // material
      translate(0, -6, 0) // transformación
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:0, z:22 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let lightPosition = { x: 0, y: 5, z: 5 };
  let lightPosTrans;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // se obtiene la matriz de vista de la cámara
    viewMatrix = camera.getMatrix();

    // se almacena la posición de la luz en el espacio de la cámara
    lightPosTrans = multiplyVector(viewMatrix, lightPosition);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(gl, projectionMatrix, viewMatrix, lightPosTrans);
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
