// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";


  ////////////////////////////////////////////////////
  // Plano donde se va a dibujar la textura con los colores del frame buffer que construimos
  let plane = new PlanoPantalla(
    gl, 
    new FramebufferBloomMaterial(gl)
  );

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1, [1,1,1,1]),
      translate(-5, 0, 0)
    ),
    new Suzanne(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1, [1,1,1,1]),
      translate(5, 0, 0)
    ),
  ];

  let bloomGeometry = [
    new Cubo(
      gl,
      new FlatMaterial(gl, [0,0,1,1]),
      translate(0, 0, 0)
    )
  ];

  let camera = new OrbitCamera(
    { x:0, y:0, z:10 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let light = new LuzPuntual(
    { x: 0, y: 5, z: 5 }, // posición
    [ 0.2, 0.2, 0.2 ],    // component ambiental
    [ 1, 1, 1 ],          // componente difuso
    [ 1, 1, 1 ]           // componente especular
  );


  ////////////////////////////////////////////////////////////
  let level = 0;
  let internalFormat = gl.RGBA;
  let texture_width  = gl.canvas.width;
  let texture_height = gl.canvas.height;
  let border = 0;
  let format = internalFormat;
  let type = gl.UNSIGNED_BYTE;
  let data = null;

  // color texture
  let color_texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, color_texture);
    
  gl.texImage2D(
    gl.TEXTURE_2D, level, internalFormat,
    texture_width, texture_height, border,
    format, type, data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  let myFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_texture, level);
  let depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture_width, texture_height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // bloom texture
  let bloom_texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, bloom_texture);
  gl.texImage2D(
    gl.TEXTURE_2D, level, internalFormat,
    texture_width, texture_height, border,
    format, type, data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  let bloomFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloomFrameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, bloom_texture, level);
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // se reutiliza el mismo depth buffer
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture_width, texture_height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // Se asocia la textura del frame buffer con el material del plano
  plane.material.texture = color_texture;

  gl.enable(gl.DEPTH_TEST);

  /**
   */
  function draw() {
    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    // Se activa el frame buffer creado, para realizar el render en él
    gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    gl.viewport(0, 0, texture_width, texture_height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(gl, projectionMatrix, viewMatrix, light);
    }

    // Se activa el frame buffer para el bloom
    gl.bindFramebuffer(gl.FRAMEBUFFER, bloomFrameBuffer);
    gl.bindTexture(gl.TEXTURE_2D, bloom_texture);
    gl.viewport(0, 0, texture_width, texture_height);
    gl.clearColor(0, 0, 0, 0);
    // solo se limpia el color y no la profundidad para utilizar los valores incluidos anteriormente cuando se dibujo la geometría normal
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i=0; i<bloomGeometry.length; i++) {
      bloomGeometry[i].draw(gl, projectionMatrix, viewMatrix, light);
    }

    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);


    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se dibuja el plano
    plane.draw(gl, projectionMatrix, viewMatrix, light, color_texture, bloom_texture);
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

});
