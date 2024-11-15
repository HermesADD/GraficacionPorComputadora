window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////

  let materialDiffuseAmbient = new DiffuseAmbientMaterial(gl, [0.1,0.1,0.1] ,[1,1,1], [0.5, 0.5, 0.5, 1]);
 
  let materialPhong = new PhongMaterial(gl, [0.1,0.1,0.1] , [1,1,1], [1,1,1], 5.0, [0.5, 0.5, 0.5, 1] );


  let geometry = [

    
    new Esfera(
      gl,
      2,
      16,
      16,
      materialDiffuseAmbient,
      translate(5, 0, 0)
    ),
  
    new Tetraedro(
      gl,
      2,
      materialDiffuseAmbient,
      identity()
    )
  
  ];

  let camera = new OrbitCamera(
    { x:0, y:10, z:10 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  // la posición de la luz en el espacio del mundo
  let lightPosition = { x: 0, y: 5, z: 5 };

  let ambientLightColor = [2, 1, 4];

  let ld = [1,1,1];

  let ls = [1,1,1];

  
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  
  let phong_shading = document.getElementById("phong_shading");
  let ambient_diffuse_shading = document.getElementById("ambient_diffuse");

  let shading_type = (!phong_shading.checked) ? "normal" : "phong";
  for (let i=0, l=geometry.length; i<l; i++) {
    if(shading_type == "phong"){
      geometry[i].isPhong = true;
      geometry[i].material = materialPhong;
    }
    console.log(geometry[i].material)
  }
  
  function radio_shading() {
    shading_type = (!phong_shading.checked) ? "normal" : "phong";

    for (let i=0, l=geometry.length; i<l; i++) {
      if(shading_type == "phong"){
        geometry
        geometry[i].isPhong = true;
        geometry[i].material = materialPhong;
      }else{
        geometry[i].material = materialDiffuseAmbient;
      }
      console.log(geometry[i].material)
    }
    draw();
  }

  phong_shading.addEventListener("change", radio_shading);
  ambient_diffuse_shading.addEventListener("change", radio_shading);

 
  /**
   */
  function update(elapse) {
    for (let i=0; i<geometry.length; i++) {
      geometry[i].update(elapse);
    }
  }

  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();

    let lightPositionList = multiplyVector(viewMatrix, lightPosition);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(gl, 
        projectionMatrix, 
        viewMatrix, 
        [lightPositionList.x,lightPositionList.y,lightPositionList.z],
        {
          ambient : ambientLightColor,
          diffuse : ld,
          specular : ls, 
        }
      );
    }
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
  camera.registerMouseEvents(gl.canvas, draw);
});
