// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  ////////////////////////////////////////////////////
  let image = await loadImage("grass.png");

  ////////////////////////////////////////////////////
  let geometry = [
    new Plano(
      gl,
      new FlatMaterial(gl, [0.1, 0.9, 0.2, 1]),
      scale(20, 20, 20)
    ),
  ];

  // El objeto grass_plane es el objeto que se quiere repetir varias veces
  // en lugar de crear muchas copias del mismo objeto, lo que trae el costo de crear los buffers de datos de todas las copias en la GPU; simplemente se van a crear varias matrices de transformación para colocar el pasto en diferentes posiciones
  let grass_plane = new Plano(
    gl,
    new TextureAlphaMaterial(gl, image)
  );

  // Se define un limite donde se pueden crear los valores aleatorios para la posición, en el caso de construir un escenario, estos valores deben estar almacenados en alguna variable en vez de crearlos aleatoriamente
  let lim = 20;
  // Un arreglo para almacenar todas las transformaciones, el número de elementos de este arreglo será el número de copias que se dibujaran
  let grass_transformation = [];
  // Se determina el número de instancias que se van a dibujar
  let num_instancias = 1500;
  // Se crean y almacenan las transformaciones, ya que es más barato almacenar matrices de transformación que toda la información geométrica de las instancias, en este caso es solo un plano, pero para objeto más complejos esto conlleva un gran ahorro en el espacio en VRAM
  for (let i=0; i<num_instancias; i++) {
    grass_transformation.push(
      multiply(
        // se determina una posición aleatoria en x y z, mientras que siempre se tiene una altura (y) de 1
        translate(-lim+Math.random()*lim*2, 1, -lim+Math.random()*lim*2),
        // se rota el plano PI/2 en el eje X, para que no quede acostado
        rotateX(Math.PI/2)
      )
    );
  }


  let camera = new OrbitCamera(
    { x:0, y:5, z:15 }, // posición
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
  gl.clearColor(0.203125, 0.59375, 0.85546875, 1);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    // Se dibuja la geometría normal
    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        light
      );
    }

    // Todo esto se puede encapsular en un objeto que sea el encargado de dibujar multiples instancias de un mismo objeto
    // Se dibujan las instancias de grass_plane, es decir, se dibuja varias veces el mismo objeto pero cambiando su transformación
    for (let i=0; i<num_instancias; i++) {
      // Se modifica la transformación del pasto
      grass_plane.transform = grass_transformation[i];
      // Se dibuja una instancia del pasto con la transformación asignada
      grass_plane.draw(
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
