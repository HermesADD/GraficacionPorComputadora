window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";

  ////////////////////////////////////////////////////
  let geometry = [
    new Teapot(gl, new PhongMaterial(gl), translate(0, 0, 0)),
  ];

  let materials = [
    new PhongMaterial(gl, [0.329412, 0.223529, 0.027451], [0.780392, 0.568627, 0.113725], [0.992157, 0.941176, 0.807843], 27.8974  ),
    new PhongMaterial(gl, [0.2125, 0.1275, 0.054], [0.714, 0.4284, 0.18144], [0.393548, 0.271906, 0.166721], 25.6  ),
    new PhongMaterial(gl, [0.25, 0.148, 0.06475], [0.4, 0.2368, 0.1036], [0.774597, 0.458561, 0.200621], 76.8  ),
    new PhongMaterial(gl, [0.25, 0.25, 0.25], [0.4, 0.4, 0.4], [0.774597, 0.774597, 0.774597], 76.8  ),
    new PhongMaterial(gl, [0.19125, 0.0735, 0.0225], [0.7038, 0.27048, 0.0828], [0.256777, 0.137622, 0.086014], 12.8  ),
    new PhongMaterial(gl, [0.2295, 0.08825, 0.0275], [0.5508, 0.2118, 0.066], [0.580594, 0.223257, 0.0695701], 51.2  ),
    new PhongMaterial(gl, [0.24725, 0.1995, 0.0745], [0.75164, 0.60648, 0.22648], [0.628281, 0.555802, 0.366065], 51.2  ),
    new PhongMaterial(gl, [0.24725, 0.2245, 0.0645], [0.34615, 0.3143, 0.0903], [0.797357, 0.723991, 0.208006], 83.2  ),
    new PhongMaterial(gl, [0.105882, 0.058824, 0.113725], [0.427451, 0.470588, 0.541176], [0.333333, 0.333333, 0.521569], 9.84615  ),
    new PhongMaterial(gl, [0.19225, 0.19225, 0.19225], [0.50754, 0.50754, 0.50754], [0.508273, 0.508273, 0.508273], 51.2  ),
    new PhongMaterial(gl, [0.23125, 0.23125, 0.23125], [0.2775, 0.2775, 0.2775], [0.773911, 0.773911, 0.773911], 89.6  ),
    new PhongMaterial(gl, [0.0215, 0.1745, 0.0215], [0.07568, 0.61424, 0.07568], [0.633, 0.727811, 0.633], 76.8  ),
    new PhongMaterial(gl, [0.135, 0.2225, 0.1575], [0.54, 0.89, 0.63], [0.316228, 0.316228, 0.316228], 12.8  ),
    new PhongMaterial(gl, [0.05375, 0.05, 0.06625], [0.18275, 0.17, 0.22525], [0.332741, 0.328634, 0.346435], 38.4  ),
    new PhongMaterial(gl, [0.25, 0.20725, 0.20725], [1, 0.829, 0.829], [0.296648, 0.296648, 0.296648], 11.264  ),
    new PhongMaterial(gl, [0.1745, 0.01175, 0.01175], [0.61424, 0.04136, 0.04136], [0.727811, 0.626959, 0.626959], 76.8  ),
    new PhongMaterial(gl, [0.1, 0.18725, 0.1745], [0.396, 0.74151, 0.69102], [0.297254, 0.30829, 0.306678], 12.8  ),
    new PhongMaterial(gl, [0.0, 0.0, 0.0], [0.01, 0.01, 0.01], [0.50, 0.50, 0.50], 32  ),
    new PhongMaterial(gl, [0.0, 0.1, 0.06], [0.0, 0.50980392, 0.50980392], [0.50196078, 0.50196078, 0.50196078], 32  ),
    new PhongMaterial(gl, [0.0, 0.0, 0.0], [0.1, 0.35, 0.1], [0.45, 0.55, 0.45], 32  ),
    new PhongMaterial(gl, [0.0, 0.0, 0.0], [0.5, 0.0, 0.0], [0.7, 0.6, 0.6], 32  ),
    new PhongMaterial(gl, [0.0, 0.0, 0.0], [0.55, 0.55, 0.55], [0.70, 0.70, 0.70], 32  ),
    new PhongMaterial(gl, [0.0, 0.0, 0.0], [0.5, 0.5, 0.0], [0.60, 0.60, 0.50], 32  ),
    new PhongMaterial(gl, [0.02, 0.02, 0.02], [0.01, 0.01, 0.01], [0.4, 0.4, 0.4], 10  ),
    new PhongMaterial(gl, [0.0, 0.05, 0.05], [0.4, 0.5, 0.5], [0.04, 0.7, 0.7], 10  ),
    new PhongMaterial(gl, [0.0, 0.05, 0.0], [0.4, 0.5, 0.4], [0.04, 0.7, 0.04], 10  ),
    new PhongMaterial(gl, [0.05, 0.0, 0.0], [0.5, 0.4, 0.4], [0.7, 0.04, 0.04], 0.1*128  ),
    new PhongMaterial(gl, [0.05, 0.05, 0.05], [0.5, 0.5, 0.5], [0.7, 0.7, 0.7], 10  ),
    new PhongMaterial(gl, [0.05, 0.05, 0.0], [0.5, 0.5, 0.4], [0.7, 0.7, 0.04], 10  ),
  ];

  // se le indica a la tetera que se dibuje de forma suave
  geometry[0].isSmooth = true;
  // se le asigna a la tetera el primer material de la lista
  geometry[0].material = materials[0];


  let camera = new OrbitCamera(
    { x:0, y:5, z:10 }, // posición
    { x:0, y:0, z:0 }, // centro de interés
    { x:0, y:1, z:0 }, // vector hacia arriba
  );
  let viewMatrix;

  let projectionMatrix = perspective(45*Math.PI/180, gl.canvas.width/gl.canvas.height, 0.1, 2000);;

  let light = new LuzDirecional(
    { x: 0, y: -5, z: 0 }, // dirección
    [ 0.2, 0.2, 0.2 ],     // component ambiental
    [ 1, 1, 1 ],           // componente difuso
    [ 1, 1, 1 ]            // componente especular
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);


  /**
   */
  function draw() {
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    viewMatrix = camera.getMatrix();

    // se actualiza la posición de la luz
    light.update(viewMatrix);

    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw(
        gl, 
        projectionMatrix, 
        viewMatrix, 
        light
      );
    }
  }

  draw();

  // la cámara registra su manejador de eventos
  camera.registerMouseEvents(gl.canvas, draw);

  // 
  let material_select = document.getElementById("material_select");
  material_select.addEventListener("change", () => {
    let mat_index = parseInt(material_select.value);
    geometry[0].material = materials[mat_index];
    draw();
  });

});
