window.addEventListener("load", function(evt) {
  // Se obtiene una referencia al canvas
  let canvas = document.getElementById("the_canvas");

  // Se obtiene una referencia al contexto de render de WebGL
  const gl = canvas.getContext("webgl2");

  // Si el navegador no soporta WebGL la variable gl no está definida y se lanza una excepción
  if (!gl) throw "WebGL no soportado";


  // Se crean y posicionan los modelos geométricos, uno de cada tipo
  let geometryAmbientDiffuse = [
    new Cilindro(
      gl, 
      2, 4, 16, 16,  
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.188, 0.439, 0.333], // Kd // el color
        5, // shininess
      ),
      Matrix4.translate(new Vector3(-5, 0, -5))
    ),
    new Cono(
      gl, 
      2, 4, 16, 16,  
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,1,0], // Kd // el color
        5, // shininess
      ),
      Matrix4.translate(new Vector3(0, 0, -5))
    ),
    new Dodecaedro(
      gl, 
      1,  
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,0,1], // Kd // el color
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(5, 0, -5))
    ),
    new Esfera(
      gl, 
      2, 16, 16,  
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,1,1], // Kd // el color
        5, // shininess
      ),
      Matrix4.translate(new Vector3(-5, 0, 0))
    ),
    new Icosaedro(gl, 
      1, 
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,0,1], // Kd // el color
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    new Octaedro(
      gl, 
      2,  
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,1,0], // Kd // el color
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(5, 0, 0))
    ),
    new PrismaRectangular(
      gl, 
      2, 3, 4, 
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,0.2,0.3], // Kd // el color
        5.0, // shininess
      ), 
      Matrix4.translate(new Vector3(-5, 0, 5))
    ), 
    new Tetraedro(
      gl, 
      2,  
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.5,0.5,0.5], // Kd // el color
        5.0, // shininess
      ),
       Matrix4.translate(new Vector3(0, 0, 5))
      ),
    new Toroide(
      gl, 
      1.5, 0.6, 16, 16, 
      new AmbientDiffuseMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.25,0.25,0.25], // Kd // el color
        5, // shininess
      ), 
      Matrix4.translate(new Vector3(5, 0, 5))
    ),
  ];


  let geometryBlinnPhon = [
    new Cilindro(
      gl, 
      2, 4, 16, 16,  
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.188, 0.439, 0.333], // Kd // el color
        [1,1,1], 
        5, // shininess
      ),
      Matrix4.translate(new Vector3(-5, 0, -5))
    ),
    new Cono(
      gl, 
      2, 4, 16, 16,  
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,1,0], // Kd // el color
        [1,1,1],
        5, // shininess
      ),
      Matrix4.translate(new Vector3(0, 0, -5))
    ),
    new Dodecaedro(
      gl, 
      1,  
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,0,1], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(5, 0, -5))
    ),
    new Esfera(
      gl, 
      2, 16, 16,  
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,1,1], // Kd // el color
        [1,1,1],
        5, // shininess
      ),
      Matrix4.translate(new Vector3(-5, 0, 0))
    ),
    new Icosaedro(gl, 
      1, 
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,0,1], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    new Octaedro(
      gl, 
      2,  
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,1,0], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(5, 0, 0))
    ),
    new PrismaRectangular(
      gl, 
      2, 3, 4, 
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,0.2,0.3], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ), 
      Matrix4.translate(new Vector3(-5, 0, 5))
    ), 
    new Tetraedro(
      gl, 
      2,  
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.5,0.5,0.5], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
       Matrix4.translate(new Vector3(0, 0, 5))
      ),
    new Toroide(
      gl, 
      1.5, 0.6, 16, 16, 
      new BlinnPhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.25,0.25,0.25], // Kd // el color
        [1,1,1],
        5, // shininess
      ), 
      Matrix4.translate(new Vector3(5, 0, 5))
    ),
  ];
  //Prueba para ver diferencia con BlinnPhong
  let geometryPhong = [
    new Cilindro(
      gl, 
      2, 4, 16, 16,  
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.188, 0.439, 0.333], // Kd // el color
        [1,1,1], 
        5, // shininess
      ),
      Matrix4.translate(new Vector3(-5, 0, -5))
    ),
    new Cono(
      gl, 
      2, 4, 16, 16,  
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,1,0], // Kd // el color
        [1,1,1],
        5, // shininess
      ),
      Matrix4.translate(new Vector3(0, 0, -5))
    ),
    new Dodecaedro(
      gl, 
      1,  
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,0,1], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(5, 0, -5))
    ),
    new Esfera(
      gl, 
      2, 16, 16,  
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0,1,1], // Kd // el color
        [1,1,1],
        5, // shininess
      ),
      Matrix4.translate(new Vector3(-5, 0, 0))
    ),
    new Icosaedro(gl, 
      1, 
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,0,1], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    new Octaedro(
      gl, 
      2,  
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,1,0], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
      Matrix4.translate(new Vector3(5, 0, 0))
    ),
    new PrismaRectangular(
      gl, 
      2, 3, 4, 
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [1,0.2,0.3], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ), 
      Matrix4.translate(new Vector3(-5, 0, 5))
    ), 
    new Tetraedro(
      gl, 
      2,  
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.5,0.5,0.5], // Kd // el color
        [1,1,1],
        5.0, // shininess
      ),
       Matrix4.translate(new Vector3(0, 0, 5))
      ),
    new Toroide(
      gl, 
      1.5, 0.6, 16, 16, 
      new PhongMaterial(
        gl, 
        [0.1,0.1,0.1], // Ka
        [0.25,0.25,0.25], // Kd // el color
        [1,1,1],
        5, // shininess
      ), 
      Matrix4.translate(new Vector3(5, 0, 5))
    ),
  ];

  // Se define la posición de la cámara (o el observador o el ojo)
  let camera = new Vector3(0, 10, 7);

  // Se define la posición del centro de interés, hacia donde observa la cámara
  let coi = new Vector3(0, -2, 0);

  // Se define el vector hacia arriba de la cámara
  let up = new Vector3(0, 1, 0);

  // Se crea una matriz de cámara (o de la vista)
  let viewMatrix = Matrix4.lookAt( camera, coi, up );

  // Se construye la matriz de proyección en perspectiva
  let projectionMatrix = Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, 1, 2000);

  let light = {
    pos: [0, 5, 0],           // Posición de la luz
    color: [1, 1, 1],         // Color de la luz (blanca)
    ambient: [1, 1, 1],       // Luz ambiental (La)
    diffuse: [1, 1, 1],       // Luz difusa (Ld)
    specular: [1, 1, 1]       // Luz especular (Ls)
  };

  // Se define una matriz que combina las transformaciones de la vista y de proyección

  // Se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
  gl.enable(gl.DEPTH_TEST);

  // Se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Se determina el color con el que se limpia la pantalla, en este caso un color negro transparente
  gl.clearColor(0, 0, 0, 0);
  
  // La función de dibujado
  function draw(blinnPhong) {
    // Se limpian tanto el buffer de color, como el buffer de profundidad
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(blinnPhong){
      for (let i=0; i<geometryBlinnPhon.length; i++) {
        geometryBlinnPhon[i].draw( 
          gl,
          projectionMatrix, // referencia al contexto de render de WebGL
          viewMatrix,
          light// la matriz de transformación de la vista y proyección
        );
      }
    }else{
      // Se itera sobre cada objeto geométrico definido, cada objeto utiliza su propio programa y VAO para dibujarse
      for (let i=0; i<geometryAmbientDiffuse.length; i++) {
        geometryAmbientDiffuse[i].draw( 
          gl,
          projectionMatrix, // referencia al contexto de render de WebGL
          viewMatrix,
          light// la matriz de transformación de la vista y proyección
      );
    }
    }
  }

  draw();

  let blinn_ckbx = document.getElementById("blinn_ckbx");
  blinn_ckbx.addEventListener("change", ()=> {
    draw(blinn_ckbx.checked);
  });

});


//////////////////////////////////////////////////////////
// Funciones de utilería para la construcción de shaders
//////////////////////////////////////////////////////////
function createProgram(gl, vertexSrc, fragmentSrc) {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexSrc);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return;
  }

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentSrc);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return;
  }

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}