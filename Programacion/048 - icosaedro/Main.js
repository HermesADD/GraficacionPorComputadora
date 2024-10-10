window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  // se construye un icosaedro
  let geo = new Icosaedro(1, "#f39c12");


  let camera = new Camera(
    { x: 5, y: 5, z: 5 },
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

  geo.transformed_vertices = [];

  /** */
  function update(elapse) {
    viewMatrix = camera.getMatrix();

    geo.transform = rotateY(theta += elapse);

    for (let i=0; i<geo.vertices.length; i++) {
      // transformación del modelo
      geo.transformed_vertices[i] = multiplyVector(geo.transform, geo.vertices[i]);

      // transformación de la cámara
      geo.transformed_vertices[i] = multiplyVector(viewMatrix, geo.transformed_vertices[i]);
    }

    ///////////////////////////////////////////////
    // Se ordenan las caras respecto al promedio de su coordenada Z, el ordenamiento se realiza en el espacio de la cámara, ya que las transformaciones de proyección y de la pantalla modifican la coordenada en z
    geo.sorted_faces = geo.faces.sort(function(face1, face2) {
      // se calcula el promedio de las z de los tres vértices de una cara
      const tmp_face1 = (geo.transformed_vertices[face1[0]].z + geo.transformed_vertices[face1[1]].z + geo.transformed_vertices[face1[2]].z)/3;

      // se calcula el promedio de las z de los tres vértices de otra cara
      const tmp_face2 = (geo.transformed_vertices[face2[0]].z + geo.transformed_vertices[face2[1]].z + geo.transformed_vertices[face2[2]].z)/3;

      // se compara el promedio de las z y con esta condición se decide que cara es menor que otra y así ordenarla
      return tmp_face1 - tmp_face2;
    });
    ///////////////////////////////////////////////

    for (let i=0; i<geo.vertices.length; i++) {
      // transformación de perspectiva
      geo.transformed_vertices[i] = multiplyVector(perspectiveMatrix, geo.transformed_vertices[i]);

      // se aplica la transformación de la pantalla
      geo.transformed_vertices[i] = screenTransform(canvas.width, canvas.height, geo.transformed_vertices[i]);
    }
  }

  /** */
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    geo.sorted_faces.forEach((face) => {
      context.fillStyle = geo.color;
      context.beginPath();
      face.forEach((vertex_index, index) => {
        let vertex = geo.transformed_vertices[vertex_index];

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