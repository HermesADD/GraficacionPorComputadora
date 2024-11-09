window.addEventListener("load", async function(evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let universe = await loadImage("texturas/universo.jpg");
  let texSol = await loadImage("texturas/sol.jpg");
  let texMercurio = await loadImage("texturas/mercurio.jpg");
  let texVenus= await loadImage("texturas/venus.jpg");
  let texTierra = await loadImage("texturas/tierra.jpg");
  let texMarte = await loadImage("texturas/marte.jpg");
  let texJupiter = await loadImage("texturas/jupiter.jpg");
  let texSaturno = await loadImage("texturas/saturno.jpg");
  let texAnillosSaturno = await loadImage("texturas/anillosSaturno.png");
  let texUrano = await loadImage("texturas/urano.jpg");
  let texNeptuno = await loadImage("texturas/neptuno.jpg");
  let texLuna = await loadImage("texturas/luna.jpg");

  let geometry = [
    new Esfera(
      gl,
      1050, 16, 16,
      new TextureMaterial(gl, universe),
      Matrix4.identity(),
    ),
    new Esfera(
      gl, 
      230, 16, 16, 
      new TextureMaterial(gl, texSol),
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    new Esfera(
      gl, 
      5, 16, 16, 
      new TextureMaterial(gl, texMercurio),
      Matrix4.translate(new Vector3(-330, 0, 0))
    ),
    new Esfera(
      gl, 
      15, 16, 16, 
      new TextureMaterial(gl, texVenus),
      Matrix4.translate(new Vector3(-430, 0, 0))
    ),
    new Esfera(
      gl,
      20, 16, 16,
      new TextureMaterial(gl, texTierra),
      Matrix4.translate(new Vector3(-530,0,0))
    ),
    new Esfera(
      gl,
      4, 16, 16,
      new TextureMaterial(gl, texLuna),
      Matrix4.translate(new Vector3(-555,25,0))
    ),
    new Esfera(
      gl,
      15, 16, 16,
      new TextureMaterial(gl, texMarte),
      Matrix4.translate(new Vector3(-630,0,0))
    ),
    new Esfera(
      gl,
      45, 16, 16,
      new TextureMaterial(gl, texJupiter),
      Matrix4.translate(new Vector3(-750,0,0))
    ),
    new Esfera(
      gl,
      35, 16, 16,
      new TextureMaterial(gl, texSaturno),
      Matrix4.translate(new Vector3(-870,0,0))
    ),
    new Anillo(
      gl,
      55, 
      40, 
      32, 
      new TextureMaterial(gl, texAnillosSaturno),
      Matrix4.translate(new Vector3(-870, 0, 0)) 
    ),
    new Esfera(
      gl,
      25, 16, 16,
      new TextureMaterial(gl, texUrano),
      Matrix4.translate(new Vector3(-970,0,0))
    ),
    new Esfera(
      gl,
      23, 16, 16,
      new TextureMaterial(gl, texNeptuno),
      Matrix4.translate(new Vector3(-1000,0,0))
    ),
  ];

  let camera = new OrbitCamera(
    new Vector3(0, 1000, 70),
    new Vector3(0, -2, 0),
    new Vector3(0, 1, 0),
  );
  
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);

  let lightPosition = new Vector4(0,0,0,0);

  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  
  let time = 0;

  function updateTransformations() {
    // Rotación de los planetas alrededor del sol
    time += 0.01;

    geometry[2].transform = Matrix4.multiply(Matrix4.rotateY(time * 1.6), Matrix4.translate(new Vector3(-330, 0, 0))); 
    geometry[3].transform = Matrix4.multiply(Matrix4.rotateY(time * 1.2), Matrix4.translate(new Vector3(-430, 0, 0))); 
    geometry[4].transform = Matrix4.multiply(Matrix4.rotateY(time), Matrix4.translate(new Vector3(-530, 0, 0))); 
    geometry[5].transform = Matrix4.multiply(geometry[4].transform, Matrix4.translate(new Vector3(25, 0, 0))); 
    geometry[6].transform = Matrix4.multiply(Matrix4.rotateY(time * 0.8), Matrix4.translate(new Vector3(-630, 0, 0))); 
    geometry[7].transform = Matrix4.multiply(Matrix4.rotateY(time * 0.4), Matrix4.translate(new Vector3(-750, 0, 0))); 
    geometry[8].transform = Matrix4.multiply(Matrix4.rotateY(time * 0.3), Matrix4.translate(new Vector3(-870, 0, 0))); 
    geometry[9].transform = geometry[8].transform; 
    geometry[10].transform = Matrix4.multiply(Matrix4.rotateY(time * 0.2), Matrix4.translate(new Vector3(-970, 0, 0))); 
    geometry[11].transform = Matrix4.multiply(Matrix4.rotateY(time * 0.1), Matrix4.translate(new Vector3(-1000, 0, 0))); 
  }

  let isAnimating = false;
  
  function draw() {
    if (!isAnimating) {
      isAnimating = true; // Activa la bandera para evitar llamadas múltiples.
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    let trans_lightPosition = viewMatrix.multiplyVector(lightPosition);

    updateTransformations();

    for (let i = 0; i < geometry.length; i++) {
      geometry[i].draw(
        gl,
        projectionMatrix,
        viewMatrix,
        {
          pos: [
            trans_lightPosition.x,
            trans_lightPosition.y,
            trans_lightPosition.z
          ],
          ambient: [0.5, 0.5, 0.5],
          diffuse: [1, 1, 1],
          especular: [1, 1, 1]
        }
      );
    }

    requestAnimationFrame(draw);
  }

  draw();
  camera.registerMouseEvents(gl.canvas, () => {
    // Solo llama a draw si no está ya corriendo
    if (!isAnimating) {
      draw();
    }
  });
});