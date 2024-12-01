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
      4050, 16, 16,
      new TextureMaterial(gl, universe),
      Matrix4.identity(),
    ),
    new Esfera(
      gl, 
      220, 16, 16, 
      new TextureMaterial(gl, texSol),
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    new Esfera(
      gl, 
      5, 16, 16, 
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1],
        [1,1,1], 
        [1,1,1], 
        100,
        texMercurio),
      Matrix4.translate(new Vector3(-530, 0, 0))
    ),
    new Esfera(
      gl, 
      12, 16, 16, 
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100, texVenus),
      Matrix4.translate(new Vector3(-730, 0, 0))
    ),
    new Esfera(
      gl,
      18, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100, 
        texTierra),
      Matrix4.translate(new Vector3(-930,0,0))
    ),
    new Esfera(
      gl,
      2, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100,
        texLuna),
      Matrix4.translate(new Vector3(-955,-25,0))
    ),
    new Esfera(
      gl,
      13, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100,
        texMarte),
      Matrix4.translate(new Vector3(-1130,0,0))
    ),
    new Esfera(
      gl,
      40, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1],
        [1,1,1], 
        100, 
        texJupiter),
      Matrix4.translate(new Vector3(-1350,0,0))
    ),
    new Esfera(
      gl,
      30, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1],
        [1,1,1], 
        [1,1,1], 
        100,
        texSaturno),
      Matrix4.translate(new Vector3(-1570,0,0))
    ),
    new Anillo(
      gl,
      55, 
      40, 
      32, 
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100, 
        texAnillosSaturno),
      Matrix4.translate(new Vector3(-1570, 0, 0)) 
    ),
    new Esfera(
      gl,
      20, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100,
        texUrano),
      Matrix4.translate(new Vector3(-1770,0,0))
    ),
    new Esfera(
      gl,
      20, 16, 16,
      new PhongTextureMaterial(gl, 
        [0.1,0.1,0.1], 
        [1,1,1], 
        [1,1,1], 
        100,
        texNeptuno),
      Matrix4.translate(new Vector3(-1900,0,0))
    ),
  ];

  let camera = new OrbitCamera(
    new Vector3(0, 2200, 70),
    new Vector3(0, -2, 0),
    new Vector3(0, 1, 0),
  );
  
  let projectionMatrix = Matrix4.perspective(
    75*Math.PI/180,  
    canvas.width/canvas.height, 
    0.1,  
    9000  
  );
  let light = new LuzPuntual(
    new Vector4(0,0,0,1),
    [ 0.2, 0.2, 0.2 ],    
    [ 1, 1, 1 ],         
    [ 1, 1, 1 ]           
  );


  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  
  let time = 0;

  function updateTransformations(){
    
    time += 0.0023;
  
    geometry[2].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 1.6),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 2),  
        Matrix4.translate(new Vector3(-430, 0, 0))
      )
    ); 
  
    geometry[3].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 1.2),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 1.5),  
        Matrix4.translate(new Vector3(-630, 0, 0))
      )
    ); 
  
    geometry[4].transform = Matrix4.multiply(
      Matrix4.rotateY(time),  
      Matrix4.multiply(
        Matrix4.rotateY(time), 
        Matrix4.translate(new Vector3(-830, 0, 0))
      )
    ); 
  
    
    geometry[5].transform = Matrix4.multiply(
      geometry[4].transform,  
      Matrix4.multiply(
        Matrix4.rotateY(time * 1.5),  
        Matrix4.translate(new Vector3(-25, 20, 0))
      )
    ); 
  
    geometry[6].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 0.8),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 1.3),  
        Matrix4.translate(new Vector3(-1030, 0, 0))
      )
    ); 
  
    geometry[7].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 0.4),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 0.9),  
        Matrix4.translate(new Vector3(-1250, 0, 0))
      )
    ); 
  
    geometry[8].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 0.3),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 0.6), 
        Matrix4.translate(new Vector3(-1470, 0, 0))
      )
    ); 
    
    geometry[9].transform = geometry[8].transform; 
  
    geometry[10].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 0.2),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 0.4),  
        Matrix4.translate(new Vector3(-1600, 0, 0))
      )
    ); 
  
    geometry[11].transform = Matrix4.multiply(
      Matrix4.rotateY(time * 0.1),  
      Matrix4.multiply(
        Matrix4.rotateY(time * 0.2),
        Matrix4.translate(new Vector3(-1800, 0, 0))
      )
    ); 
  }

  let isAnimating = false;
  
  function draw() {
    if (!isAnimating) {
      isAnimating = true;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    light.update(viewMatrix);


    updateTransformations();
    for (let i = 0; i < geometry.length; i++) {
      geometry[i].draw(
        gl,
        projectionMatrix,
        viewMatrix,
        light
      );
    }

    requestAnimationFrame(draw);
  }

  draw();
  camera.registerKeyEvents(gl.canvas, () => {
    if (!isAnimating) {
      draw();
    }
  });
});