window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Suzanne(
      gl, 
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [243/255, 156/255, 18/255], // Kd // el color
        [1,1,1], // Ks
        1, // shininess
      ),
      identity() // transformación
    ),
    new Esfera(
      gl, 
      2, // radio
      16, // Nu
      16, // Nv
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [22/255, 160/255, 133/255], // Kd // el color
        [0.9,0.9,0.9], // Ks
        5, // shininess
      ),
      translate(-6, 0, 0) // transformación
    ),
    new Teapot(
      gl, 
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [52/255, 152/255, 219/255], // Kd // el color
        [0.8,0.8,0.8], // Ks
        10, // shininess
      ),
      translate(6, 0, 0) // transformación
    ),
    new PrismaRectangular(
      gl, 
      4, //w
      4, //h
      4, //l
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1, 0.2, 0.3], // Kd // el color
        [0.7,0.7,0.7], // Ks
        20, // shininess
      ),
      translate(0, 6, 0) // transformación
    ),
    new Engrane(
      gl, 
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [241/255, 196/255, 15/255], // Kd // el color
        [0.6,0.6,0.6], // Ks
        40, // shininess
      ),
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
  let lightAmbiental = [1,1,1];
  let lightDiffuse = [1,1,1];
  let lightEspecular = [1,1,1];
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
