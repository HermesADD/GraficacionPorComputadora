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
    [0, 1, 2], [3, 0, 2],
    [4, 5, 6], [7, 4, 6],
    [0, 5, 1], [4, 5, 0],
    [7, 6, 2], [7, 2, 3],
    [7, 4, 0], [7, 0, 3],
    [6, 5, 1], [6, 1, 2],
  ];

  let colors = [
    "#ff0000", "#ff0000",
    "#00ff00", "#00ff00",
    "#0000ff", "#0000ff",
    "#00ffff", "#00ffff",
    "#ff00ff", "#ff00ff",
    "#ffff00", "#ffff00",
  ];

  let camera = new Camera(
    { x: 3, y: 3, z: 3 },
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

    faces.forEach((face, f_index) => {
      context.fillStyle = colors[f_index];
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
      context.fill();
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
    current = Date.now();
    elapsed = (current - lastTime) / 1000;
    lastTime = current;

    if (elapsed > max_elapsed_wait) {
      elapsed = max_elapsed_wait;
    }

    update(elapsed);
    draw();

    window.requestAnimationFrame(gameLoop);
  }
  gameLoop();
});