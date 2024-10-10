class PrismaRectangular {
  /**
   */
  constructor(gl, width=1, height=1, length=1, color="#ffffff", transform=identity()) {
    this.w = width;
    this.h = height;
    this.l = length;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();


    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;

    uniform mat4 u_PVM_matrix;

    void main() {
      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      pixelColor = u_color;
    }`;

    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    let positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");

    this.colorUniformLocation = gl.getUniformLocation(this.program, "u_color");
    this.PVM_matrixLocation = gl.getUniformLocation(this.program, "u_PVM_matrix");


    this.shapeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.shapeVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    this.num_elements = this.faces.length;

    this.theta = 0;

    this.createWireframe(gl, positionAttributeLocation, positionBuffer);
  }

  /**
   * 
   */
  createWireframe(gl, positionAttributeLocation, positionBuffer) {
    // Se cera un Vertex Array Buffer para almacenar los datos de dibujo del objeto
    this.wireframeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.wireframeVAO);

    // se reutiliza el arreglo de vértices construido anteriormente (función getVertices), así no aumenta la cantidad de memoria requerida
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // se reutiliza la referencia a la variable u_position del programa, para que se cargue la información desde el buffer de posiciones
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    // se construye un nuevo arreglo de índices para indicar que aristas se dibujan, los índices hacen referencia a los vértices definidos anteriormente
    let edges = [
      0, 2,
      2, 6,
      6, 4,
      4, 0,

      1, 3,
      3, 7,
      4, 5,
      5, 1,

      4, 5,
      0, 1,
      2, 3,
      6, 7,
    ];

    // se crea un nuevo buffer de datos para almacenar los indices de las aristas
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edges), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.num_wireframe_elements = edges.length;
  }

  /**
   * 
   */
  update(elapsed) {
    this.transform = rotateY(this.theta += elapsed);
  }

  /**
   * 
   */
  draw(gl, projectionViewMatrix) {
    gl.useProgram(this.program);

    let projectionViewModelMatrix = multiply(projectionViewMatrix, this.transform);

    gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix);
    gl.uniform4fv(this.colorUniformLocation, this.color);

    gl.bindVertexArray(this.shapeVAO);
    gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);


    // Se dibuja el wireframe del objeto, usando un color negro [0,0,0,1] y la primitiva gl.LINES
    gl.uniform4fv(this.colorUniformLocation, [0,0,0,1]);
    gl.bindVertexArray(this.wireframeVAO);
    gl.drawElements(gl.LINES, this.num_wireframe_elements, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }

  /**
   * 
   */
  getVertices() {
    return [
       this.w/2,  this.h/2,  this.l/2,
       this.w/2, -this.h/2,  this.l/2,
       this.w/2,  this.h/2, -this.l/2,
       this.w/2, -this.h/2, -this.l/2,
      -this.w/2,  this.h/2,  this.l/2,
      -this.w/2, -this.h/2,  this.l/2,
      -this.w/2,  this.h/2, -this.l/2,
      -this.w/2, -this.h/2, -this.l/2,
    ];
  }

  /**
   * En comparación con los ejemplos anteriores, los cuadriláteros que definen el prisma deben triangularse, es decir, partirse en dos triángulos para poder dibujarlos con WebGL
   */
  getFaces() {
    return [
      2, 3, 1,
      2, 1, 0,

      1, 5, 4,
      1, 4, 0,

      5, 7, 6,
      5, 6, 4,

      6, 7, 3,
      6, 3, 2,

      4, 6, 2,
      4, 2, 0,

      3, 7, 5,
      3, 5, 1,
    ];
  }
}
