window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  let vertices = [
    { x:  1, y: -1, z: 0 },
    { x:  1, y:  1, z: 0 },
    { x: -1, y:  1, z: 0 },
    { x: -1, y: -1, z: 0 }
  ];
  
  let faces = [[0, 1, 2], [3, 0, 2]];

  let rotationXMatrix;
  let nuevos_vertices = [];

  /** */
  function update(theta) {
    // se construye una matriz de rotación en el eje X
    rotationXMatrix = rotateX(theta);

    vertices.forEach((vertex, index) => {
      nuevos_vertices[index] = multiplyVector(rotationXMatrix, vertex);
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

  update(0);
  draw();

  /** */
  let range_rot = document.getElementById("range_rot");
  range_rot.value = 0;

  /** */
  range_rot.addEventListener("input", function() {
    update(parseFloat(range_rot.value));
    draw();
  });
});