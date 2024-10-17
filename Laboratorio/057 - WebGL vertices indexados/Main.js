window.addEventListener("load", function(evt) {
  const gl = document.getElementById("the_canvas").getContext("webgl2");
  if (!gl) throw "WebGL no soportado";
  
  let vertexShaderSource =
  `#version 300 es

  in vec4 a_position;
   
  void main() {
    gl_Position = a_position;
  }`;

  let fragmentShaderSource = 
  `#version 300 es
  precision mediump float;

  out vec4 pixelColor;

  void main() {
    pixelColor = vec4(1, 1, 1, 1);
  }`;

  let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);


  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  let shapeVAO = gl.createVertexArray();
  gl.bindVertexArray(shapeVAO);

  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  let positions = [
    -0.5, -0.5, 0,
     0.5, -0.5, 0,
     0.5,  0.5, 0,
    -0.5,  0.5, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
 
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // para dibujar objetos geométricos por medio de indices, como se hacia en los ejemplos antes de WebGL, es necesario crear un buffer de elementos que contenga los indices que relacionan los vértices para dibujar un objeto geométrico
  let indexBuffer = gl.createBuffer();
  // el tipo del buffer ahora es "ELEMENT_ARRAY_BUFFER", estos buffers simplemente contienen indices que relacionen los datos de los buffers de datos de tipo "ARRAY_BUFFER"
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Los indices almacenados en el buffer
  let indices = [
    0, 1, 2, // el primer triángulo: (-0.5, -0.5, 0), (0.5, -0.5, 0), (0.5, 0.5, 0)
    2, 3, 0  // el segundo triángulo: (0.5, 0.5, 0), (-0.5, 0.5, 0), (-0.5, -0.5, 0)
  ]
  // Se envía la información a la GPU
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  gl.clearColor(0, 0, 0, 1);

  /**
   * 
   */
  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(shapeVAO);

    // La función para dibujar geometría indexada es "drawElements"
    // Básicamente, si queremos dibujar buffers de tipo "ARRAY_BUFFER" usamos "drawArrays"
    // y si queremos dibujar buffers de tipo "ELEMENT_ARRAY_BUFFER" usamos "drawElements"
    // Hay que notar que "drawElements" recibe los parámetros de forma diferente
    gl.drawElements(
      gl.TRIANGLES, // tipo de primitiva
      6, // el número de indices
      gl.UNSIGNED_SHORT, // el tipo de datos almacenado en el buffer de indices
      0 // el desplazamiento, es decir, desde que elemento se comienza a dibujar
    );

    gl.bindVertexArray(null);
  }

  draw();

});
