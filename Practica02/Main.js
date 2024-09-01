window.addEventListener("load", function() {
  let canvas = document.getElementById("the_canvas");
  let context = canvas.getContext("2d");
  
  context.fillStyle = "#2c3e50";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let tmp_v;

  let obj = {
    vertices : [
      new Vector3(50, 50, 1),
      new Vector3(0, -80, 1),
      new Vector3(-100, 50, 1)
    ]
  }

  context.fillStyle = "#2ecc71";
  context.beginPath();
  context.moveTo(obj.vertices[0].x, obj.vertices[0].y);
  for (let i=1; i<obj.vertices.length; i++) {
    context.lineTo(obj.vertices[i].x, obj.vertices[i].y);
  }
  context.closePath();
  context.fill();

  let translate1M = Matrix3.translate(200, 300);
  context.fillStyle = "#3498db";
  context.beginPath();
  tmp_v = translate1M.multiplyVector(obj.vertices[0]);
  context.moveTo(tmp_v.x, tmp_v.y);
  for (let i=1; i<obj.vertices.length; i++) {
    tmp_v = translate1M.multiplyVector(obj.vertices[i]);
    context.lineTo(tmp_v.x, tmp_v.y);
  }
  context.closePath();
  context.fill();

  let translate2M = Matrix3.translate(500, 200);
  let scaleM = Matrix3.scale(3, -2);
  context.fillStyle = "#f1c40f";
  context.beginPath();
  tmp_v = translate2M.multiplyVector(scaleM.multiplyVector(obj.vertices[0]));
  context.moveTo(tmp_v.x, tmp_v.y);
  for (let i=1; i<obj.vertices.length; i++) {
    tmp_v = translate2M.multiplyVector(scaleM.multiplyVector(obj.vertices[i]));
    context.lineTo(tmp_v.x, tmp_v.y);
  }
  context.closePath();
  context.fill();

  let translate3M = Matrix3.translate(700, 500);
  let rotateM = Matrix3.rotate(Math.PI/8);
  context.fillStyle = "#ecf0f1";
  context.beginPath();
  tmp_v = translate3M.multiplyVector(rotateM.multiplyVector(obj.vertices[0]));
  context.moveTo(tmp_v.x, tmp_v.y);
  for (let i=1; i<obj.vertices.length; i++) {
    tmp_v = translate3M.multiplyVector(rotateM.multiplyVector(obj.vertices[i]));
    context.lineTo(tmp_v.x, tmp_v.y);
  }
  context.closePath();
  context.fill();

  ////////////////////////////////////////////////////////////////////////////////////////////
  // Algunas pruebas para ver que su implementación es correcta
  // Para ver los resultados hay que abrir la consola
  let M1 = new Matrix3(
    1, 2, 3, 
    0, 1, 4, 
    5, 6, 0
  );
  let M2 = new Matrix3(
    -24,  18,  5, 
     20, -15, -4, 
    -5,   4,   1
  );
  let M3 = new Matrix3(
    1, 2, 3, 
    3, 2, 1, 
    1, 0, 1
  );

  console.log(Matrix3.add(M1, M2));
  /**
  Devuelve: 
  a00: -23, a01: 20,  a02: 8, 
  a10: 20,  a11: -14, a12: 0, 
  a20: 0,   a21: 10,  a22: 1 
  */

  console.log(Matrix3.multiply(M1, M2));
  /**
  Devuelve: 
  a00: 1, a01: 0, a02: 0, 
  a10: 0, a11: 1, a12: 0, 
  a20: 0, a21: 0, a22: 1 
  */

  console.log(Matrix3.multiplyScalar(M1, 5));
  /**
  Devuelve: 
  a00: 5,  a01: 10, a02: 15, 
  a10: 0,  a11: 5,  a12: 20, 
  a20: 25, a21: 30, a22: 0 
  */

  console.log(M1.determinant());
  /**
  Devuelve: 
  1
  */

  console.log(M3.adjoint());
  /**
  Devuelve: 
  a00: 2,  a01: -2, a02: -4, 
  a10: -2, a11: -2, a12: 8, 
  a20: -2, a21: 2,  a22: -4 
  */

  console.log(M1.invert());
  /**
  Devuelve: 
  a00: -24, a01: 18,  a02: 5,
  a10: 20,  a11: -15, a12: -4,
  a20: -5,  a21: 4,   a22: 1 
  */

  console.log(M1.transpose());
  /**
  Devuelve: 
  a00: 1, a01: 0, a02: 5, 
  a10: 2, a11: 1, a12: 6, 
  a20: 3, a21: 4, a22: 0 
  */

  console.log(Matrix3.multiply(M1, M1.invert()));
  /**
  Devuelve:
  a00: 1, a01: 0, a02: 0, 
  a10: 0, a11: 1, a12: 0, 
  a20: 0, a21: 0, a22: 1 
  */

  M2.identity();
  console.log(M2);
  /**
  Devuelve:
  a00: 1, a01: 0, a02: 0, a10: 0, a11: 1, a12: 0, a20: 0, a21: 0, a22: 1 
  */
});