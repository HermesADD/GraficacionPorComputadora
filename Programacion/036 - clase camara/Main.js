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

  //
  let camera = new Camera(
    { x: 0, y: 0, z: 5 }, // Posición inicial de la cámara
    { x: 0, y: 0, z: 0 }, // Objetivo de la cámara o Center Of Interest (COI)
    { x: 0, y: 1, z: 0} // Vector hacia arriba del sistema de referencia
  );

  let viewMatrix;

  let nuevos_vertices = [];

  /** */
  function update() {
    // se actualiza la transformación de la cámara
    viewMatrix = camera.getMatrix();

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
  cam_x.value = camera.pos.x;
  cam_y.value = camera.pos.y;
  cam_z.value = camera.pos.z;
  coi_x.value = camera.coi.x;
  coi_y.value = camera.coi.y;
  coi_z.value = camera.coi.z;

  cam_x.addEventListener("input", cambiarCamaraPos);
  cam_y.addEventListener("input", cambiarCamaraPos);
  cam_z.addEventListener("input", cambiarCamaraPos);
  function cambiarCamaraPos() {
    camera.setPos({
      x: parseFloat(cam_x.value),
      y: parseFloat(cam_y.value),
      z: parseFloat(cam_z.value),
    })
    update();
    draw();
  };

  // La función addEventListener es útil para agregar a un objeto varios manejadores de un mismo tipo de evento, por ejemplo es posible agregar varias funciones manejadores para el evento "input"
  // En caso de que no sea necesario agregar varias funciones para manejar un mismo evento, JavaScript proporciona otra manera de agregar un manejador, esto por medio de unas variables que tiene el prefijo "on" seguido del evento que se quiere controlar, por ejemplo, oninput 
  coi_x.oninput = coi_y.oninput = coi_z.oninput = function() {
    camera.setCOI({
      x: parseFloat(coi_x.value),
      y: parseFloat(coi_y.value),
      z: parseFloat(coi_z.value),
    })
    update();
    draw();
  };
  // Como se puede observar, en comparación con los eventos para el camio de posición de la cámara, esta forma (usando la versión variables de los eventos) permite asignar una misma función a varios manejadores de forma simultanea, haciendo más compacto el código

});