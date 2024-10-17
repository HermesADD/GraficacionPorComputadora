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

  let aspect = canvas.width/canvas.height;
  let frustumMatrix = frustum(
    -4*aspect, 4*aspect, // left, right
    -4, 4, // bottom, top
    -2, 2, // near, far;
  );

  // Trasformación a coordenadas de la pantalla aplicada a un vértice
  function screenTransform(w, h, v) {
    return {
      x:  (v.x/v.w)*w/2 + w/2,
      y: -(v.y/v.w)*h/2 + h/2,
      z:  (v.z/v.w)
    };
  }


  let nuevos_vertices = [];

  /** */
  function update() {
    viewMatrix = camera.getMatrix();

    vertices.forEach((vertex, index) => {
      // se aplica la trasformación de la cámara
      nuevos_vertices[index] = multiplyVector(viewMatrix, vertex);
      // después se aplica la transformación de proyección ortográfica
      nuevos_vertices[index] = multiplyVector(frustumMatrix, nuevos_vertices[index]);

      // por último se aplica la transformación de la pantalla
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

  update();
  draw();

  /** */
  let cam_x = document.getElementById("cam_x");
  let cam_y = document.getElementById("cam_y");
  let cam_z = document.getElementById("cam_z");
  let coi_x = document.getElementById("coi_x");
  let coi_y = document.getElementById("coi_y");
  let coi_z = document.getElementById("coi_z");

  // se inician los valores de los controles con el valor de la cámara
  cam_x.value = camera.pos.x;
  cam_y.value = camera.pos.y;
  cam_z.value = camera.pos.z;
  coi_x.value = camera.coi.x;
  coi_y.value = camera.coi.y;
  coi_z.value = camera.coi.z;

  cam_x.oninput = cam_y.oninput = cam_z.oninput = function() {
    camera.setPos({
      x: parseFloat(cam_x.value),
      y: parseFloat(cam_y.value),
      z: parseFloat(cam_z.value),
    })
    update();
    draw();
  };

  coi_x.oninput = coi_y.oninput = coi_z.oninput = function() {
    camera.setCOI({
      x: parseFloat(coi_x.value),
      y: parseFloat(coi_y.value),
      z: parseFloat(coi_z.value),
    })
    update();
    draw();
  };
});