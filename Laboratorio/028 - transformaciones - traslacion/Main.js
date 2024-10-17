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

  let translateMatrix;
  let nuevos_vertices = [];

  /** */
  function update(tx, ty, tz) {
    // se construye una matriz de traslación
    translateMatrix = translate(tx, ty, tz);

    vertices.forEach((vertex, index) => {
      // se aplica la traslación a los vértices de la geometría y se obtienen nuevos vértices
      nuevos_vertices[index] = multiplyVector(translateMatrix, vertex);
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

  update(0, 0, 0);
  draw();


  /** */
  let range_x = document.getElementById("range_x");
  let range_y = document.getElementById("range_y");
  let range_z = document.getElementById("range_z");

  // se inician los valores de los controles en 0
  range_x.value = 0;
  range_y.value = 0;
  range_z.value = 0;

  /** */
  function auxUpdate() {
    update(parseFloat(range_x.value), parseFloat(range_y.value), parseFloat(range_z.value));
    draw();
  }
  range_x.addEventListener("input", auxUpdate);
  range_y.addEventListener("input", auxUpdate);
  range_z.addEventListener("input", auxUpdate);
});