window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(
      gl,
      new PhongMaterial(
        gl,
        [0.0215, 0.1745, 0.0215], 
        [0.07568, 0.61424, 0.07568], 
        [0.633, 0.727811, 0.633], 
        76.8, 
        1 // opacidad
      ),
      translate(0, 0, -4)
    ),
    new Teapot(
      gl,
      new PhongMaterial(
        gl,
        [0.0215, 0.1745, 0.0215], 
        [0.07568, 0.61424, 0.07568], 
        [0.633, 0.727811, 0.633], 
        76.8, 
        0.5 // opacidad
      ),
      translate(0, 0, 0)
    ),
    new Teapot(
      gl,
      new PhongMaterial(
        gl,
        [0.0215, 0.1745, 0.0215], 
        [0.07568, 0.61424, 0.07568], 
        [0.633, 0.727811, 0.633], 
        76.8, 
        0.25 // opacidad
      ),
      translate(0, 0, 4)
    ),
  ];

  // Para la transparencia no es suficiente asignar un valor de alpha diferente de 1

  let camera = new OrbitCamera(
    { x:0, y:8, z:8 }, // posición
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
  gl.clearColor(0, 0, 0, 0);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();

    // se actualiza la posición de la luz
    light.update(viewMatrix);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        light
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
