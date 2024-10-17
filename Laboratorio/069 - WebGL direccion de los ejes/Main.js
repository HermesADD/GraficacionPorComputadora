window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";


  let geometry = [
    new Ejes(gl)
  ];

  let camera_y_up = new Camera(
    { x: 5, y: 5, z: 5 },
    { x: 0, y: 0, z: 0 },
    // Al utilizar el vector up = { x: 0, y: 1, z: 0 }, es decir, el eje Y, tenemos que en la representación del espacio global el eje Y es el eje hacia arriba, quedando el eje X de forma horizontal y el eje Z hacia adentro (o afuera) de la pantalla
    { x: 0, y: 1, z: 0 }
  );

  let camera_z_up = new Camera(
    { x: 5, y: 5, z: 5 },
    { x: 0, y: 0, z: 0 },
    // Al utilizar el vector up = { x: 0, y: 0, z: 1 }, es decir, el eje Z, tenemos que en la representación del espacio global el eje Z es el eje hacia arriba, quedando el eje X de forma horizontal y el eje Y hacia adentro (o afuera) de la pantalla
    { x: 0, y: 0, z: 1 }
  );

  // Se va a dibujar en una área de la mitad del ancho del canvas, y como la función perspective necesita la relación de aspecto del área donde se va a dibujar, se construyen unas variables auxiliares
  let area_w = gl.canvas.width/2;
  let area_h = gl.canvas.height;

  let projectionMatrix = perspective(45*Math.PI/180, area_w/area_h, 0.1, 2000);;

  gl.clearColor(0, 0, 0, 0);

  // Se habilita el buffer de profundidad para dibujar correctamente los triángulos sin importar el orden de aparición de la geometría
  gl.enable(gl.DEPTH_TEST);

  /** */
  function draw() {
    // Se limpia el buffer de colores (la imagen que se despliega en la pantalla) y el buffer de profundidad
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // se especifica un viewport (o ventana, o espacio de dibujo) de la mitad del ancho del canvas, para dibujar los ejes con Y hacia arriba, del lado izquierdo del canvas
    gl.viewport(0, 0, area_w, area_h);

    // Se dibujan los ejes con la cámara que tiene el eje Y hacia arriba
    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl,
        multiply(projectionMatrix, camera_y_up.getMatrix()) // Se combina la matriz de vista y la matriz de proyección
      );
    }


    // se especifica un viewport de la mitad del ancho del canvas, para dibujar los ejes con Z hacia arriba, ocupando el lado derecho del canvas
    gl.viewport(area_w, 0, area_w, area_h);

    // Se dibujan los ejes con la cámara que tiene el eje Z hacia arriba
    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl,
        multiply(projectionMatrix, camera_z_up.getMatrix()) // Se combina la matriz de vista y la matriz de proyección
      );
    }

    // Hay que observar que en los dos ciclos de dibujado, solo cambia la cámara (y su matriz correspondiente, getMatrix), y tanto la geometría como la matriz de perspectiva son las mismas
  }

  draw()
});
