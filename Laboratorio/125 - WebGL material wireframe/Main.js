window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Suzanne(
      gl, 
      new WireframeMaterial(gl),
      translate(-2.5, 0, 0) // transformación
    ),
    new Teapot(
      gl, 
      new WireframeMaterial(gl),
      translate(2.5, 0, 0) // transformación
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:5, z:10 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let lightPosition = { x: 0, y: 5, z: 5 };
  let lightAmbiental = [0.2,0.2,0.2];
  let lightDiffuse = [1,1,1];
  let lightEspecular = [1,1,1];
  let lightPosTrans;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0,0,0,0);

  gl.enable(gl.DEPTH_TEST);


  /**
   */
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // se obtiene la matriz de vista de la cámara
    viewMatrix = camera.getMatrix();

    // se almacena la posición de la luz en el espacio de la cámara
    lightPosTrans = multiplyVector(viewMatrix, lightPosition);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        {
          position: [lightPosTrans.x, lightPosTrans.y, lightPosTrans.z],
          ambient: lightAmbiental,
          diffuse: lightDiffuse,
          especular: lightEspecular
        }
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);
});
