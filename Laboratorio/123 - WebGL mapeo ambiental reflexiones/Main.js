// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  // En webgl las imágenes se encuentran reflejadas respecto al eje Y, por lo que para usarlas directamente es necesario indicarle que les de la vuelta
  // si se utiliza el cube map puede salir invertido
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  ////////////////////////////////////////////////////
  // Se carga la imagen del skybox
  let x_p = await loadImage("x_pos.png");
  let x_n = await loadImage("x_neg.png");
  let y_p = await loadImage("y_pos.png");
  let y_n = await loadImage("y_neg.png");
  let z_p = await loadImage("z_pos.png");
  let z_n = await loadImage("z_neg.png");

  ////////////////////////////////////////////////////
  let geometry = [
    new Skybox(
      gl,
      new SkyboxMaterial(gl, x_p, x_n, y_p, y_n, z_p, z_n),
      scale(500, 500, 500)
    ),

    new Esfera(
      gl,
      2,
      16,
      16,
      new SkyboxMaterial(gl, x_p, x_n, y_p, y_n, z_p, z_n),
      translate(-6, 0, 0),
    ),
    new Suzanne(
      gl,
      new ReflectionTextureMaterial( gl, x_p, x_n, y_p, y_n, z_p, z_n ),
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