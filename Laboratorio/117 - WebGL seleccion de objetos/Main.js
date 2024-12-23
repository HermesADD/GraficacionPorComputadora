// Es importante el async
window.addEventListener("load", async function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(-5, 0, 0)
    ),
    new Cubo(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(0, 0, 0)
    ),
    new Suzanne(
      gl,
      new PhongMaterial(gl, [0.1,0.1,0.1], [1, 0.2, 0.4], [0,0,0], 1),
      translate(5, 0, 0)
    ),
  ];
  geometry[0].isSmooth = true;
  geometry[2].isSmooth = true;

  let camera = new OrbitCamera(
    { x:0, y:1, z:15 }, // posición
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
  // Para realizar el render en una textura, es necesario crear varias cosas, entre ellas se necesita un framebuffer y texturas asociadas para almacenar su información

  // Para almacenar la información de color se crea una textura
  let color_texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, color_texture);
  
  let level = 0;
  let internalFormat = gl.RGBA;
  let texture_width  = gl.canvas.width;
  let texture_height = gl.canvas.height;
  let border = 0;
  let format = internalFormat;
  let type = gl.UNSIGNED_BYTE;
  let data = null;
  
  // Similar a como construimos las texturas a partir de imágenes utilizamos la función texImage2D, pero esta vez con parámetros adicionales para indicar el tamaño y formato de la textura que estamos creando
  gl.texImage2D(
    gl.TEXTURE_2D, level, internalFormat,
    texture_width, texture_height, border,
    format, type, data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Un frame buffer es un lugar en memoria en la GPU donde escribe sus resultados el shader de fragmentos y etapas subsecuentes (mezclado y composición); para almacenar esta información se necesitan áreas de memoria las cuales se asignan por medio de texturas
  let myFrameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);

  // La función framebufferTexture2D asocia una textura a un elemento particular del frame buffer, en este caso se asocia con el color (gl.COLOR_ATTACHMENT)
  // En WebGL2 es posible tener hasta 16 texturas asignadas al color, esto con la finalidad de escribir varios a datos durante la misma ejecución de un shader de fragmentos
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color_texture, level);

  // Además de una textura para almacenar los colores, se necesita un componente para almacenar la profundidad, es decir, un z-buffer para el nuevo frame buffer, así que se crea un render buffer para este fin
  let depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture_width, texture_height);

  // Se asocia al frame buffer activo el nuevo buffer de profundidad
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

  // Se libera la textura activa
  gl.bindTexture(gl.TEXTURE_2D, null);

  // Se libera el frame buffer activo
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  ////////////////////////////////////////////////////////////


  // Se crea un conjunto de materiales planos, para dibujar la geometría en el frame buffer que acabamos de crear, para posteriormente leer la textura de colores y en base al color obtenido determinar cual ha sido el objeto geométrico seleccionado
  let picking_material = new FlatMaterial(gl);
  let picking_colors = [];

  // El número de objetos de la escena, determina la cantidad de materiales, en este caso el indice el objeto en el arreglo geometry determina el color, en este caso solo se utiliza la componente roja para codificar el indice de la geometría lo que da un total de 256 objetos seleccionables, para tener más objetos seleccionables se pueden usar las componentes verde, azul y alfa para la codificación
  for (let i=0; i<geometry.length; i++) {
    picking_colors.push([i/256, 0, 0, 1]);
  }

  // En la variable pixelColor se va a almacenar el color del pixel asociado con la posición del mouse
  let pixelColor = new Uint8Array(4);
  ////////////////////////////////////////////////////////////

  // Se crea un material para dibujar un borde y así indicar cual es el objeto seleccionado
  let borderMaterial = new BorderMaterial(gl, [1,1,1,1]);


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

    // Se dibujan los objetos con el material de selección
    for (let i=0; i<geometry.length; i++) {
      // Al material plano de selección se le asocia cual es su color de la lista de colores, hay que recordar que cada objeto en el arreglo geometry tiene asociado un único color en el arreglo picking_colors
      picking_material.color = picking_colors[i];

      // Se utiliza la función drawMaterial para dibujar la geometría con el material de selección
      geometry[i].drawMaterial(gl, picking_material, projectionMatrix, viewMatrix, light);
    }

    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);


    // Al asignar el frame buffer activo como null, se utiliza el frame buffer por defecto, es decir, el frame buffer de la tarjeta de video el que se dibuja en pantalla
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se dibujan los objetos de forma usual
    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(gl, projectionMatrix, viewMatrix, light);

      // Se dibuja el borde del objeto seleccionado
      if (geometry[i].border) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        geometry[i].drawMaterial(gl, borderMaterial, projectionMatrix, viewMatrix, light);
        gl.disable(gl.CULL_FACE);
      }
    }

  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

  //////////////////////////////////////////////////
  // Se agrega el control para convertir la posición del mouse a una posición en pantalla y obtener el color de la textura asociada al frame buffer no visible

  // La posición del mouse
  let mouse_position;
  // El indice del objeto seleccionado
  let last_picked = -1;

  // El manejador de eventos para detectar donde se pulso el botón del ratón
  gl.canvas.addEventListener("mousedown", (evt) => {
    // Se obtiene la posición del ratón dentro del canvas
    mouse_position = getMousePositionInElement(evt, gl.canvas);

    // Para obtener el color en la textura en la posición del ratón, hay que normalizar la posición, recordando que las coordenadas de textura van de 0 a 1
    mouse_position.x = (mouse_position.x/gl.canvas.width) * texture_width;
    // Hay que recordar que las coordenada y en el canvas aumenta positivamente hacia abajo, mientras que en las coordenadas de textura aumenta positivamente hacia arriba
    mouse_position.y = ((gl.canvas.height - mouse_position.y)/gl.canvas.height) * texture_height;

    // Se activa el frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);

    // Y la textura para acceder a su información
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    
    // La función readPixels permite leer información de la textura activa y guardar esa información en el último parámetro
    gl.readPixels(mouse_position.x, mouse_position.y, 1 ,1, gl.RGBA, gl.UNSIGNED_BYTE, pixelColor);

    // Se libera la textura
    gl.bindTexture(gl.TEXTURE_2D, null);
    // Se libera el frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // console.log(pixelColor);

    // Si ya existe un elemento seleccionado se le quita el atributo del borde
    if (last_picked >= 0) {
      geometry[last_picked].border = false;
    }

    // Los colores en el arreglo picking_colors se construyen con la componente alfa igual a 1, mientras que el color del fondo tienen un alfa de 0
    if ( pixelColor[3] !== 0 ) {
      last_picked = pixelColor[0];
      geometry[last_picked].border = true;
    }
    // Se dio click en el fondo
    else {
      last_picked = -1;
    }

    // Una vez determinado si se selecciono o no un objeto se redibuja la escena
    draw();
  });

});
