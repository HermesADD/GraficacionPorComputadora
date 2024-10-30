// Es importante el async
window.addEventListener("load", async function(evt) {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) throw "WebGL no soportado";

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let texEsfera = await loadImage("texturas/esfera.png");
  let texIcosaedro = await loadImage("texturas/icosaedro.png");


  let geometry = [
    // new Cilindro(
    //   gl, 
    //   2, 4, 16, 16, 
    //   new TextureMaterial(gl, texCilindro),
    //   Matrix4.translate(new Vector3(-5, 0, -5))
    // ),
    // new Cono(
    //   gl, 
    //   2, 4, 16, 16, 
    //   new TextureMaterial(gl, texCono),
    //   Matrix4.translate(new Vector3(0, 0, -5))
    // ),
    // new Dodecaedro(
    //   gl, 
    //   1, 
    //   new TextureMaterial(gl, texDodecaedro),
    //   Matrix4.translate(new Vector3(5, 0, -5))
    // ),
    new Esfera(
      gl, 
      2, 16, 16, 
      new TextureMaterial(gl, texEsfera),
      Matrix4.translate(new Vector3(-5, 0, 0))
    ),
    new Icosaedro(gl, 
      1, 
      new TextureMaterial(gl, texIcosaedro), 
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    // new Octaedro(
    //   gl, 
    //   2, 
    //   new TextureMaterial(gl, texOctaedro), 
    //   Matrix4.translate(new Vector3(5, 0, 0))
    // ),
    // new PrismaRectangular(
    //   gl, 
    //   2, 3, 4, 
    //   new TextureMaterial(gl, texPrismaRectangular),
    //   Matrix4.translate(new Vector3(-5, 0, 5))
    // ),
    // new Tetraedro(
    //   gl, 
    //   2, 
    //   new TextureMaterial(gl, texTetraedro),
    //   Matrix4.translate(new Vector3(0, 0, 5))
    // ),
    // new Toroide(
    //   gl, 
    //   1.5, 0.6, 16, 16, 
    //   new TextureMaterial(gl, texToroide),
    //   Matrix4.translate(new Vector3(5, 0, 5))
    // ),
  ];

  let camera = new Camera(
    new Vector3(0, 10, 7),
    new Vector3(0, -2, 0),
    new Vector3(0, 1, 0),
  );
  
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);

  let lightPosition = new Vector4(5,5,5,1);

  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = camera.getMatrix();
    let trans_lightPosition = viewMatrix.multiplyVector(lightPosition);

    for (let i=0; i<geometry.length; i++) {
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
          ambient: [0.2,0.2,0.2],
          diffuse: [1,1,1],
          especular: [1,1,1]
        }
      );
    }
  }

  draw();
});