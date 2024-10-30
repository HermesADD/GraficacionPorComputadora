// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Cubo(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(-2, 0, 0)
    ),
    new CuboInvertido(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(2, 0, 0)
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:5, z:5 }, // posición
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


  // Se activa la opción de descartar geometría cuya dirección de su normal no apunta en la dirección de la cámara
  gl.enable(gl.CULL_FACE);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se descartan las primitivas cuya dirección de la normal es igual a la dirección de la cámara
    gl.cullFace(gl.BACK);

    // Se descartan las primitivas cuya dirección de la normal es opuesta a la dirección de la cámara
    // gl.cullFace(gl.FRONT);

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
