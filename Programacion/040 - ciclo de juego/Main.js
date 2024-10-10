window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  let vertices = [
    { x:  1, y:  1, z:  1 },
    { x:  1, y: -1, z:  1 },
    { x: -1, y: -1, z:  1 },
    { x: -1, y:  1, z:  1 },
    { x:  1, y:  1, z: -1 },
    { x:  1, y: -1, z: -1 },
    { x: -1, y: -1, z: -1 },
    { x: -1, y:  1, z: -1 },
  ];
  
  let faces = [
    [0, 1, 2], [3, 0, 2], // top
    [4, 5, 6], [7, 4, 6], // bottom
    [0, 5, 1], [4, 5, 0], // right
    [7, 6, 2], [7, 2, 3], // left
    [7, 4, 0], [7, 0, 3], // front
    [6, 5, 1], [6, 1, 2], // back
  ];

  let camera = new Camera(
    { x: 0, y: 0, z: 5 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }
  );
  let viewMatrix;
  
  let perspectiveMatrix = perspective(60*Math.PI/180, canvas.width/canvas.height, 0.1, 2000);

  // Trasformación a coordenadas de la pantalla aplicada a un vértice
  function screenTransform(w, h, v) {
    return {
      x:  (v.x/v.w)*w/2 + w/2,
      y: -(v.y/v.w)*h/2 + h/2,
      z:  (v.z/v.w)
    };
  }

  // variables auxiliares para la animación
  let theta = 0;
  let modelMatrix;
  let finalMatrix;

  let nuevos_vertices = [];

  /** */
  function update(elapse) {
    viewMatrix = camera.getMatrix();

    // se actualiza la matriz de transformación del modelo, en este caso es una rotación en el eje Y
    modelMatrix = rotateY(theta);

    // se actualiza el ángulo de rotación con el tiempo que ha pasado
    theta += elapse;

    finalMatrix = multiply(
      perspectiveMatrix,
      multiply(viewMatrix, modelMatrix)
    );

    vertices.forEach((vertex, index) => {
      nuevos_vertices[index] = multiplyVector(finalMatrix, vertex);

      // se aplica la transformación de la pantalla
      nuevos_vertices[index] = screenTransform(canvas.width, canvas.height, nuevos_vertices[index]);
    });
  }

  /** */
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      context.beginPath();
      face.forEach((vertex_index, index) => {
        let vertex = nuevos_vertices[vertex_index];

        if (index === 0) {
          context.moveTo(vertex.x, vertex.y);
        }
        else {
          context.lineTo(vertex.x, vertex.y);
        }
      });
      context.closePath();
      context.stroke();
    });
  }


  /** Variables auxiliares para el ciclo de juego */
  let lastTime = Date.now();
  let current = 0;
  let elapsed = 0;
  let max_elapsed_wait = 30/1000;
  /**
   * Función que permite realizar un ciclo de juego
   */
  function gameLoop() {
    // se obtiene el tiempo actual
    current = Date.now();

    // el tiempo en milisegundos que han transcurrido entre la ejecución anterior y la actual
    elapsed = (current - lastTime) / 1000;

    // se guarda el tiempo actual para que en el siguiente ciclo del juego se determine cuanto tiempo ha pasado
    lastTime = current;

    // si el tiempo entre cada ejecución es mayor a max_elapse_wait (buscando 30fps), usualmente significa que dejamos de observar el navegador; en este caso no queremos considerar todo el tiempo que tomo regresar a ver el navegador, si no un estimado de una treintava parte de segundo
    if (elapsed > max_elapsed_wait) {
      elapsed = max_elapsed_wait;
    }

    // update, se encarga de considerar los eventos del usuario, así como los cambios propios en el estado del juego y actualiza todos los componentes
    update(elapsed);
    // draw, se encarga de dibujar los elementos visuales del juego
    draw();

    // se le pide al navegador que llame la función gameLoop cuando termine
    window.requestAnimationFrame(gameLoop);
  }
  // se inicia la ejecución del ciclo de juego
  gameLoop();
});