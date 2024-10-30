// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let image = await loadImage("textura.png");

  ////////////////////////////////////////////////////
  let geometry = [
    new Esfera(
      gl,
      2, 
      16, 
      16,
      new TextureMaterial(gl, image),
      translate(0, 0, 0)
    ),
  ];
  // La corrección solo funciona al utilizar drawArrays, ya que es necesario tener la información de cada triángulo independiente
  // geometry[0].isSmooth = true;

  let camera = new OrbitCamera(
    { x:0, y:5, z:5 }, // posición
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


  let param_t = document.getElementById("parameter_t");
  let param_t_val = param_t.value = 0;
  param_t.addEventListener("input", () => {
    param_t_val = param_t.value;
    draw();
  });


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
        param_t_val
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
