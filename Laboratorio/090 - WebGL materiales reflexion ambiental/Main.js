window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Suzanne(
      gl, 
      new ReflexionAmbientalMaterial(gl, [0.2,0.2,0.2], [243/255, 156/255, 18/255, 1]), // material
      identity() // transformación
    ),
    new Esfera(
      gl, 
      2, // radio
      16, // Nu
      16, // Nv
      new ReflexionAmbientalMaterial(gl, [0.3,0.3,0.3], [243/255, 156/255, 18/255, 1]), // material
      translate(-6, 0, 0) // transformación
    ),
    new Teapot(
      gl, 
      new ReflexionAmbientalMaterial(gl, [0.4,0.4,0.4], [243/255, 156/255, 18/255, 1]), // material
      translate(6, 0, 0) // transformación
    ),
    new PrismaRectangular(
      gl, 
      4, //w
      4, //h
      4, //l
      new ReflexionAmbientalMaterial(gl, [0.5,0.5,0.5], [243/255, 156/255, 18/255, 1]), // material
      translate(0, 6, 0) // transformación
    ),
    new Engrane(
      gl, 
      new ReflexionAmbientalMaterial(gl, [0.6,0.6,0.6], [243/255, 156/255, 18/255, 1]), // material
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

  let ambientLightColor = [1, 1, 1];

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
      geometry[i].draw(gl, projectionMatrix, viewMatrix, ambientLightColor, lightPosTrans);
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
