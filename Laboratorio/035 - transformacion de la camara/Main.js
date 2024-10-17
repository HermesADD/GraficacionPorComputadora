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
    { x: -1, y:  1, z: -1 }
  ];
  
  let faces = [
    [0, 1, 2], [3, 0, 2], // top
    [4, 5, 6], [7, 4, 6], // bottom
    [0, 5, 1], [4, 5, 0], // right
    [7, 6, 2], [7, 2, 3], // left
    [7, 4, 0], [7, 0, 3], // front
    [6, 5, 1], [6, 1, 2], // back
  ];


  // Posición inicial de la cámara
  let camera_pos = { x: 0, y: 0, z: 5 };
  // Objetivo de la cámara o Center Of Interest (COI)
  let camera_coi = { x: 0, y: 0, z: 0 }; 
  // Vector hacia arriba del sistema de referencia
  let up = { x: 0, y: 1, z: 0};

  let viewMatrix;

  let nuevos_vertices = [];

  /** */
  function update() {
    // se actualiza la transformación de la cámara
    viewMatrix = lookAt(camera_pos, camera_coi, up);

    vertices.forEach((vertex, index) => {
      nuevos_vertices[index] = multiplyVector(viewMatrix, vertex);
    });
  }

  let Ox = canvas.width/2;
  let Oy = canvas.height/2;
  let zoom = 50;

  /** */
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      context.beginPath();
      face.forEach((vertex_index, index) => {
        let vertex = nuevos_vertices[vertex_index];

        if (index === 0) {
          context.moveTo(vertex.x*zoom + Ox, vertex.y*zoom + Oy);
        }
        else {
          context.lineTo(vertex.x*zoom + Ox, vertex.y*zoom + Oy);
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
  cam_x.value = camera_pos.x;
  cam_y.value = camera_pos.y;
  cam_z.value = camera_pos.z;
  coi_x.value = camera_coi.x;
  coi_y.value = camera_coi.y;
  coi_z.value = camera_coi.z;

  cam_x.addEventListener("input", function() {
    camera_pos.x = parseFloat(cam_x.value);
    update();
    draw();
  });
  cam_y.addEventListener("input", function() {
    camera_pos.y = parseFloat(cam_y.value);
    update();
    draw();
  });
  cam_z.addEventListener("input", function() {
    camera_pos.z = parseFloat(cam_z.value);
    update();
    draw();
  });
  coi_x.addEventListener("input", function() {
    camera_coi.x = parseFloat(coi_x.value);
    update();
    draw();
  });
  coi_y.addEventListener("input", function() {
    camera_coi.y = parseFloat(coi_y.value);
    update();
    draw();
  });
  coi_z.addEventListener("input", function() {
    camera_coi.z = parseFloat(coi_z.value);
    update();
    draw();
  });
});