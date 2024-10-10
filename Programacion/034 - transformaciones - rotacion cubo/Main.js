window.addEventListener("load", function(evt) {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");

  let vertices = [
    { x:  1, y:  0, z:  1 }, //0
    { x:  0, y:  0, z:  1 }, //1
    { x:  0, y:  0, z:  0 }, //2
    { x:  1, y:  0, z:  0 }, //3
    { x:  .5, y:  1,z:  .5 }, //4
    
    
    
  ];
  
  let faces = [
    [0, 1, 2, 3], // top
    [0, 1, 4], // bottom
    [1, 2, 4], // right
    [2, 3, 4], // left
    [3, 0, 4], // front
  ];

  let rotationXMatrix;
  let rotationYMatrix;
  let rotationZMatrix;
  let rotationsMatrix;
  let nuevos_vertices = [];

  /** */
  function update(theta_x, theta_y, theta_z) {
    rotationXMatrix = rotateX(theta_x);
    rotationYMatrix = rotateY(theta_y);
    rotationZMatrix = rotateZ(theta_z);

    rotationsMatrix = multiply(rotationZMatrix, multiply(rotationYMatrix, rotationXMatrix));

    vertices.forEach((vertex, index) => {
      nuevos_vertices[index] = multiplyVector(rotationsMatrix, vertex);
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
  let range_x = document.getElementById("range_rot_x");
  let range_y = document.getElementById("range_rot_y");
  let range_z = document.getElementById("range_rot_z");

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