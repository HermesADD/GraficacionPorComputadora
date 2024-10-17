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
  let rotationYMatrix;
  let rotationZMatrix;
  let nuevos_vertices = [];

  /** */
  function update(theta_x, theta_y, theta_z) {
    rotationXMatrix = rotateX(theta_x);
    rotationYMatrix = rotateY(theta_y);
    rotationZMatrix = rotateZ(theta_z);

    // aplicar las tres matrices de transformación por separado es equivalente a aplicar la matriz una matriz de transformación compuesta
    let rotationsMatrix = multiply(rotationZMatrix, multiply(rotationYMatrix, rotationXMatrix));

    vertices.forEach((vertex, index) => {
      // se realiza primero la rotación en X
      //nuevos_vertices[index] = multiplyVector(rotationXMatrix, vertex);
      // luego la rotación en Y
      //nuevos_vertices[index] = multiplyVector(rotationYMatrix, nuevos_vertices[index]);
      // y por ultimo la rotación en Z
      //nuevos_vertices[index] = multiplyVector(rotationZMatrix, nuevos_vertices[index]);
    
      // en caso de utilizar la matriz compuesta solo se utiliza una multiplicación de matrix con vector en lugar de tres
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