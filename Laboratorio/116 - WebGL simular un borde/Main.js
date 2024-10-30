// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(-5, 0, 0)
    ),
    new Cubo(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(0, 0, 0)
    ),
    new Suzanne(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(5, 0, 0)
    ),
  ];

  // Se crea un material para el borde de color blanco
  let borderMaterial = new BorderMaterial(gl, [1,1,1,1]);

  // Se indica cuales objetos tienen un borde
  geometry[0].border = true;
  geometry[1].border = true;
  // geometry[2].border = true;

  geometry[0].isSmooth = true;
  // geometry[2].isSmooth = true;

  let camera = new OrbitCamera(
    { x:0, y:1, z:15 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let light = new LuzPuntual(
    { x: 0, y: 5, z: 5 }, // posición
    [ 0.2, 0.2, 0.2 ],    // component ambiental
    [ 1, 1, 1 ],          // componente difuso
    [ 1, 1, 1 ]           // componente especular
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.2, 0.2, 0.2, 1);


  // Se activa la opción de descartar geometría cuya dirección de su normal no apunta en la dirección de la cámara
  gl.enable(gl.CULL_FACE);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    for (let i=0; i<geometry.length; i++) {
      // Se dibuja la geometría de forma normal, utilizando el material con el que se creo y el Vertex Array Buffer correspondiente
      geometry[i].draw(gl, projectionMatrix, viewMatrix, light);

      // Se dibuja el borde de la geometría solo en los objetos que tenga el parámetro border = true
      if (geometry[i].border) {
        // Solo se dibujan las caras traseras del objeto, descartando las caras cuya normal apunta en la dirección de la cámara
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        geometry[i].drawMaterial(gl, borderMaterial, projectionMatrix, viewMatrix, light);
        // Se desactiva el descarte de las caras para dibujar los objetos de forma normal
        gl.disable(gl.CULL_FACE);
      }
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
