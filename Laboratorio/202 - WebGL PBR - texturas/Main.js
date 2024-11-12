window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  let albedoImage = await loadImage("./textures/almond-speckled-granite_albedo.png");
  let normalImage = await loadImage("./textures/almond-speckled-granite_normal-ogl.png");
  let metallicImage = await loadImage("./textures/almond-speckled-granite_metallic.png");
  let roughnessImage = await loadImage("./textures/almond-speckled-granite_roughness.png");
  let ambientOcclusionImage = await loadImage("./textures/almond-speckled-granite_ao.png");

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(
      gl, 
      new PBRTextureMaterial(
        gl, 
        albedoImage, 
        normalImage, 
        metallicImage, 
        roughnessImage, 
        ambientOcclusionImage
      ), 
      translate(0, 0, 0)
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:5, z:10 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  // Se crean 3 luces
  let lights = [
    new LuzPuntual(
      { x: -10, y: 10, z: 10 }, // posición
      [ 0.2, 0.2, 0.2 ], // component ambiental
      [ 1, 1, 1 ], // componente difuso
      [ 1, 1, 1 ], // componente especular
      [ 300, 300, 300 ], // Flujo radiante (potencia de la luz)
    ),
    new LuzPuntual(
      { x: 10, y: 10, z: 10 }, // posición
      [ 0.2, 0.2, 0.2 ], // component ambiental
      [ 1, 1, 1 ], // componente difuso
      [ 1, 1, 1 ], // componente especular
      [ 300, 300, 300 ], // Flujo radiante (potencia de la luz)
    ),
    new LuzPuntual(
      { x: -10, y: -10, z: 10 }, // posición
      [ 0.2, 0.2, 0.2 ], // component ambiental
      [ 1, 1, 1 ], // componente difuso
      [ 1, 1, 1 ], // componente especular
      [ 300, 300, 300 ], // Flujo radiante (potencia de la luz)
    ),
    new LuzPuntual(
      { x: 10, y: -10, z: 10 }, // posición
      [ 0.2, 0.2, 0.2 ], // component ambiental
      [ 1, 1, 1 ], // componente difuso
      [ 1, 1, 1 ], // componente especular
      [ 300, 300, 300 ], // Flujo radiante (potencia de la luz)
    )
  ];
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();

    // Se actualiza la posición del arreglo de luces
    for (let light of lights) {
      light.update(viewMatrix);
    }

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        lights
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
