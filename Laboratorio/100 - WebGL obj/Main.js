window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new OBJGeometry(
      gl, 
      await parseObj("geometry/ponmi.obj"), // se lee y parsea el archivo .obj
      new PhongMaterial(gl, [0.1, 0.1, 0.1], [1, 0, 0], [0, 0, 0], 0.1), // se crea un material general, que se utiliza directamente en caso de que el archivo .obj no tenga asociado un archivo .mtl para sus materiales; en el caso de que si haya un archivo .mtl se utilizan los parámetros para configurar el material
      translate(0, -0.3, 0) // la transformación inicial del objeto
    ),
  ];


  let camera = new OrbitCamera(
    { x:0, y:0, z:1 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let light = new LuzPuntual(
    { x: 0, y: 5, z: 5 }, // posición
    [ 0.1, 0.1, 0.1 ],    // component ambiental
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
