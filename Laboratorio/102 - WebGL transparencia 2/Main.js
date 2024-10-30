window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(
      gl,
      new PhongMaterial(
        gl,
        [0.0215, 0.1745, 0.0215], 
        [0.07568, 0.61424, 0.07568], 
        [0.633, 0.727811, 0.633], 
        76.8, 
        1 // opacidad
      ),
      translate(0, 0, -4)
    ),
    new Teapot(
      gl,
      new PhongMaterial(
        gl,
        [0.0215, 0.1745, 0.0215], 
        [0.07568, 0.61424, 0.07568], 
        [0.633, 0.727811, 0.633], 
        76.8, 
        0.5 // opacidad
      ),
      translate(0, 0, 0)
    ),
    new Teapot(
      gl,
      new PhongMaterial(
        gl,
        [0.0215, 0.1745, 0.0215], 
        [0.07568, 0.61424, 0.07568], 
        [0.633, 0.727811, 0.633], 
        76.8, 
        0.25 // opacidad
      ),
      translate(0, 0, 4)
    ),
  ];

  let camera = new OrbitCamera(
    { x:0, y:8, z:8 }, // posición
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

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);

  gl.enable(gl.DEPTH_TEST);

  // Para usar la cualidad de mezclar los colores por medio de objetos con transparencia se debe activar esta opción
  gl.enable(gl.BLEND);

  // Además de activar la opción de mezclado se debe indicar cual es la forma en la que se mezcla, siguiente la siguiente ecuación
  // color_result = color_source * factor_source + color_destination * factor_destination
  // donde color_source es el color del objeto que se esta dibujando actualmente, mientras que color_destination es el color que ya se encuentra en el buffer de colores, es decir, los objetos que ya se hayan dibujado
  // para determinar los valores de factor_source y factor_destination se utiliza la función gl.blendFunc(factor_source, factor_destination);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // tenemos a nuestra disposición varias formas de mezclar los colores con las siguientes variables
  // GL_ZERO := 0
  // GL_ONE  := 1
  // GL_SRC_COLOR := el factor es igual a color_source
  // GL_ONE_MINUS_SRC_COLOR := el factor es igual a 1 menos color_source
  // GL_DST_COLOR := el factor es igual a color_destination
  // GL_ONE_MINUS_DST_COLOR := el factor es igual a 1 menos color_destination
  // GL_SRC_ALPHA := el factor es igual al componente alfa de color_source
  // GL_ONE_MINUS_SRC_ALPHA := el factor es igual a 1 menos el componente alfa de color_source
  // GL_DST_ALPHA := el factor es igual al componente alfa de color_destination
  // GL_ONE_MINUS_DST_ALPHA := el factor es igual a 1 menos el componente alfa de color_destination
  // GL_CONSTANT_COLOR := el factor es igual un valor constante especificado con gl.blendColor
  // GL_ONE_MINUS_CONSTANT_COLOR := el factor es igual 1 menos un valor constante especificado con gl.blendColor
  // GL_CONSTANT_ALPHA := el factor es igual al componente alfa de un valor constante especificado con gl.blendColor
  // GL_ONE_MINUS_CONSTANT_ALPHA := el factor es igual 1 menos el componente alfa de un valor constante especificado con gl.blendColor


  /**
   */
  function draw() {
    viewMatrix = camera.getMatrix();
    light.update(viewMatrix);

    // Primero se dibujan los elementos sólidos usando el buffer de profundidad para que se dibujen correctamente, se tiene que activar ya que al dibujar los objetos con transparencia se desactiva
    gl.depthMask(true);

    // Se limpian los buffers de color y profundidad después de activar la escritura en el buffer de profundidad, de lo contrario el buffer de profundidad no se limpia
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se itera sobre los objetos buscando cuales son sólidos
    for (let i=0; i<geometry.length; i++) {
      // Si el valor de transparencia del color del material es 1 entonces es un objeto sólido
      if (geometry[i].material.opacity == 1) {
        geometry[i].draw(
          gl, 
          projectionMatrix, 
          viewMatrix, 
          light
        );
      }
    }

    // Una vez que los objetos sólidos han coloreado sus píxeles y han modificado el buffer de profundidad, ahora es cuando se dibujan los objetos transparentes
    // para evitar descartar geometría de los objetos transparentes se desactiva la escritura en el buffer de profundidad
    gl.depthMask(false);

    for (let i=0; i<geometry.length; i++) {
      // Si el valor de transparencia del color del material es menor que 1 entonces es un objeto transparente
      if (geometry[i].material.opacity < 1) {
        geometry[i].draw(
          gl, 
          projectionMatrix, 
          viewMatrix, 
          light
        );
      }
    }

  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);
});
