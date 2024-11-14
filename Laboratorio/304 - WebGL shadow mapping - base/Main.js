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
    { x: 0, y: 8, z: 0 },
    [ 0.2, 0.2, 0.2 ],
    [ 1, 1, 1 ],
    [ 1, 1, 1 ]
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  //
  let depth_texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, depth_texture);

  let texture_width  = 512;
  let texture_height = 512;

  gl.texImage2D(
    gl.TEXTURE_2D, 
    0, 
    gl.DEPTH_COMPONENT32F,
    texture_width, 
    texture_height, 
    0,
    gl.DEPTH_COMPONENT, 
    gl.FLOAT, 
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depth_texture, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  let texture_view_matrix = lookAt(
    light.position,
    {x: 0, y: 0, z: 0},
    {x: 1, y: 0, z: 0}
  );
  let texture_projection_matrix = perspective(75*Math.PI/180, 1, 0.1, 200);
  let textureMatrix = multiply(texture_projection_matrix, texture_view_matrix);
  //

  /**
   */
  function draw() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.bindTexture(gl.TEXTURE_2D, depth_texture);
    gl.viewport(0, 0, texture_width, texture_height);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].drawSimple(gl, textureMatrix);
    }

    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        light,
        depth_texture, 
        textureMatrix
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
