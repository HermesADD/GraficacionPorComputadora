window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Suzanne(
      gl, 
      [243/255, 156/255, 18/255, 1], // color
      identity() // transformación
    ),
    new Esfera(
      gl, 
      2, // radio
      16, // Nu
      16, // Nv
      [22/255, 160/255, 133/255, 1], // color
      translate(-6, 0, 0) // transformación
    ),
    new Teapot(
      gl, 
      [52/255, 152/255, 219/255, 1], // color
      translate(6, 0, 0) // transformación
    ),
    new PrismaRectangular(
      gl, 
      4, //w
      4, //h
      4, //l
      [1, 0.2, 0.3, 1], // color
      translate(0, 6, 0) // transformación
    ),
    new Engrane(
      gl, 
      [241/255, 196/255, 15/255, 1], // color
      translate(0, -6, 0) // transformación
    ),
  ];

  let camera = new Camera(
    { x: 0, y: 0, z: 22 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }
  );

  let viewMatrix = camera.getMatrix();

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;


  // la posición de la luz en el espacio del mundo
  let lightPosition = { x: 0, y: 5, z: 5 };

  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  
  let radio_flat_shading = document.getElementById("flat_shading");
  let radio_smooth_shading = document.getElementById("smooth_shading");

  let shading_type = (radio_flat_shading.checked) ? "flat" : "smooth";
  for (let i=0, l=geometry.length; i<l; i++) {
    geometry[i].isSmooth = (shading_type == "smooth");
  }
  
  radio_flat_shading.onchange = radio_smooth_shading.onchange =   function() {
    shading_type = (radio_flat_shading.checked) ? "flat" : "smooth";

    for (let i=0, l=geometry.length; i<l; i++) {
      geometry[i].isSmooth = (shading_type == "smooth");
    }
    draw();
  };

  let normals_checkbox = document.getElementById("ver_normales");
  for (let i=0, l=geometry.length; i<l; i++) {
    geometry[i].drawNormals = normals_checkbox.checked;
  }

  normals_checkbox.onchange = function() {
    for (let i=0, l=geometry.length; i<l; i++) {
      geometry[i].drawNormals = normals_checkbox.checked;
    }
    draw();
  };


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(gl, projectionMatrix, viewMatrix, multiplyVector(viewMatrix, lightPosition));
    }
  }

  draw();
});
