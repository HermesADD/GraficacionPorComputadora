window.addEventListener("load", function(evt) {
  // Se obtiene una referencia al canvas
  let canvas = document.getElementById("the_canvas");

  // Se obtiene una referencia al contexto de render de WebGL
  const gl = canvas.getContext("webgl2");

  // Si el navegador no soporta WebGL la variable gl no está definida y se lanza una excepción
  if (!gl) throw "WebGL no soportado";


  // Se crean y posicionan los modelos geométricos, uno de cada tipo
  let geometry = [
    /**
    new Cilindro(
      gl, 
      2, 4, 16, 16, 
      [0.188, 0.439, 0.333, 1], 
      Matrix4.translate(new Vector3(-5, 0, -5))
    ),
    new Cono(
      gl, 
      2, 4, 16, 16, 
      [0, 1, 0, 1], 
      Matrix4.translate(new Vector3(0, 0, -5))
    ),
    new Dodecaedro(
      gl, 
      1, 
      [0, 0, 1, 1], 
      Matrix4.translate(new Vector3(5, 0, -5))
    ),
    new Esfera(
      gl, 
      2, 16, 16, 
      [0, 1, 1, 1], 
      Matrix4.translate(new Vector3(-5, 0, 0))
    ),
    new Icosaedro(gl, 
      1, 
      [1, 0 , 1, 1], 
      Matrix4.translate(new Vector3(0, 0, 0))
    ),
    new Octaedro(
      gl, 
      2, 
      [1, 1, 0, 1], 
      Matrix4.translate(new Vector3(5, 0, 0))
    ),
    */
    new PrismaRectangular(
      gl, 
      2, 3, 4, 
      [1, 0.2, 0.3, 1], 
      Matrix4.translate(new Vector3(-5, 0, 5))
    ),
    /** 
    new Tetraedro(
      gl, 
      2, 
      [0.5, 0.5, 0.5, 1], 
      Matrix4.translate(new Vector3(0, 0, 5))
    ),
    new Toroide(
      gl, 
      1.5, 0.6, 16, 16, 
      [0.25, 0.25, 0.25, 1], 
      Matrix4.translate(new Vector3(5, 0, 5))
    ),*/
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

  // Se define una matriz que combina las transformaciones de la vista y de proyección
  let projectionViewMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);

  ////////////////////////////////////////////////////////////////////////////////////////////
  // Algunas pruebas
  ////////////////////////////////////////////////////////////////////////////////////////////
  // La matriz de la vista
  console.log("viewMatrix", viewMatrix.toArray());
  /**
  Devuelve:
  [ 
    1, 0, 0, -0,
    0, 0.5038710255240862, -0.8637789008984335, 1.0077420510481723,
    0, 0.8637789008984335, 0.5038710255240862, -12.16488618765294,
    0, 0, 0, 1
  ]
  */

  // La matriz de proyección
  console.log("projectionMatrix", projectionMatrix.toArray());
  /**
  Devuelve:
  [ 
    0.9774190296309043, 0, 0, 0,
    0, 1.3032253728412058, 0, 0,
    0, 0, -1.001000500250125, -2.001000500250125,
    0, 0, -1, 0
  ]
  */

  // La matriz de vista-proyección
  console.log("projectionViewMatrix", projectionViewMatrix.toArray());
  /**
  Devuelve:
  [ 
    0.9774190296309043, 0, 0, 0,
    0, 0.656657505102508, -1.1256985801757278, 1.3133150102050157,
    0, -0.864643111904835, -0.5043751486111538, 10.176056659076304,
    0, -0.8637789008984335, -0.5038710255240862, 12.16488618765294
  ]
  */

  // Se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan y cuales se descartan
  gl.enable(gl.DEPTH_TEST);

  // Se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Se determina el color con el que se limpia la pantalla, en este caso un color negro transparente
  gl.clearColor(0, 0, 0, 0);
  
  // La función de dibujado
  function draw(wireframe) {
    // Se limpian tanto el buffer de color, como el buffer de profundidad
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Se itera sobre cada objeto geométrico definido, cada objeto utiliza su propio programa y VAO para dibujarse
    for (let i=0; i<geometry.length; i++) {
      geometry[i].draw( 
        gl, // referencia al contexto de render de WebGL
        projectionViewMatrix,
        wireframe // la matriz de transformación de la vista y proyección
      );
    }
  }

  // se dibujan los objetos
  draw(false);//Esto nos servira para modificar el dibujo dependiendo de si lo quiere cn wireframe o no
  //Si es true entonces se dibujara el wireframe si es false no.
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