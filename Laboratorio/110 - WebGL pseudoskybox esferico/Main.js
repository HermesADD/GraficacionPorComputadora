// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  // En webgl las imágenes se encuentran reflejadas respecto al eje Y, por lo que para usarlas directamente es necesario indicarle que les de la vuelta
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  ////////////////////////////////////////////////////
  // Se carga la imagen del skybox
  let skybox = await loadImage("skybox.png");

  ////////////////////////////////////////////////////
  let geometry = [
    new Esfera(
      gl,
      500,
      16,
      16,
      new TextureMaterial(gl, skybox)
    ),

    new Esfera(
      gl,
      2,
      16,
      16,
      new FlatMaterial( gl, [43/255, 16/255, 218/255, 1] ),
      translate(-6, 0, 0),
    ),
    new Suzanne(
      gl,
      new PhongMaterial( gl, [0.1,0.1,0.1], [243/255, 156/255, 18/255], [1,1,1], 1 ),
      translate(0, 0, 0),
    ),
    new Teapot( 
      gl,
      new PhongMaterial( gl, [0.05375, 0.05, 0.06625], [0.18275, 0.17, 0.22525], [0.332741, 0.328634, 0.346435], 38.4 ),
      translate(6, 0, 0),
    )
  ];

  let camera = new OrbitCamera(
    { x:0, y:2, z:20 }, // posición
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
        light
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});