// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Cubo(
      gl,
      new ProjectedTextureMaterial(gl, [1, 0.2, 0.4, 1]),
      translate(0, 2, 0)
    ),
    new Plano(
      gl,
      new ProjectedTextureMaterial(gl, [0.1, 0.2, 1, 1]),
      scale(10, 10, 10)
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:15, z:15 },
    { x:0, y:0, z:0 },
    { x:0, y:1, z:0 },
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);

  let light = new LuzPuntual(
    { x: 0, y: 5, z: 0 },
    [ 0.2, 0.2, 0.2 ],
    [ 1, 1, 1 ],
    [ 1, 1, 1 ]
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  let image_brick = await loadImage("brick.jpg");

  //
  let projectedTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, projectedTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image_brick);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let texture_view_matrix = lookAt(
    {x: 0, y: 5, z: 0},
    {x: 0, y: 0, z: 0},
    {x: 1, y: 0, z: 0}
  );
  let texture_projection_matrix = perspective(75*Math.PI/180, 1, 0.1, 200);
  let textureMatrix = multiply(texture_projection_matrix, texture_view_matrix);
  //

  /**
   */
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        light,
        projectedTexture, 
        textureMatrix
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
