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


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_elements = this.vertices.length/3;

    this.theta = 0;

    this.createWireframe(gl, positionAttributeLocation);
  }

  /**
   * 
   */
  createWireframe(gl, positionAttributeLocation) {
    // Se cera un Vertex Array Buffer para almacenar los datos de dibujo del objeto
    this.wireframeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.wireframeVAO);


    // se crea el arreglo de vértices para definir la geometría de las aristas
    // de nuevo se aplanan los índices utilizados en el ejemplo con drawElements
    let edge_positions = [
      this.w/2,  this.h/2,  this.l/2, 
      this.w/2,  this.h/2, -this.l/2,
      this.w/2,  this.h/2, -this.l/2, 
      -this.w/2,  this.h/2, -this.l/2,
      -this.w/2,  this.h/2, -this.l/2, 
      -this.w/2,  this.h/2,  this.l/2,
      -this.w/2,  this.h/2,  this.l/2, 
      this.w/2,  this.h/2,  this.l/2,

      this.w/2, -this.h/2,  this.l/2, 
      this.w/2, -this.h/2, -this.l/2,
      this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,
      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,
      -this.w/2, -this.h/2,  this.l/2, 
      this.w/2, -this.h/2,  this.l/2,

      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,
      this.w/2,  this.h/2,  this.l/2, 
      this.w/2, -this.h/2,  this.l/2,
      this.w/2,  this.h/2, -this.l/2, 
      this.w/2, -this.h/2, -this.l/2,
      -this.w/2,  this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,
    ];

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edge_positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_wireframe_elements = edge_positions.length/3;
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
    gl.uniform4fv(this.colorUniformLocation, [0,0,0,1]);


    gl.bindVertexArray(this.shapeVAO);
    gl.drawArrays(gl.LINES, 0, this.num_elements);
    gl.bindVertexArray(null);

     
    // Se dibuja el wireframe del objeto, usando un color negro y la primitiva LINES
    gl.uniform4fv(this.colorUniformLocation, [0,0,0,1]);
    gl.bindVertexArray(this.wireframeVAO);
    gl.drawArrays(gl.LINES, 0, this.num_wireframe_elements);
    gl.bindVertexArray(null);
    
  }


  /**
   * Los vértices se obtienen aplanando el arreglo de indices, es decir, reemplazando cada indice por las tres coordenadas del vértices correspondiente
   */
  getVertices() {
    return [
      this.w/2,  this.h/2, -this.l/2, 
      this.w/2, -this.h/2, -this.l/2, 
      this.w/2, -this.h/2,  this.l/2,
      this.w/2,  this.h/2, -this.l/2, 
      this.w/2, -this.h/2,  this.l/2, 
      this.w/2,  this.h/2,  this.l/2,

      this.w/2, -this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2,
      this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2, 
      this.w/2,  this.h/2,  this.l/2,

      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2, -this.h/2, -this.l/2, 
      -this.w/2,  this.h/2, -this.l/2,
      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2, -this.l/2, 
      -this.w/2,  this.h/2,  this.l/2,

      -this.w/2,  this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2, 
      this.w/2, -this.h/2, -this.l/2,
      -this.w/2,  this.h/2, -this.l/2, 
      this.w/2, -this.h/2, -this.l/2, 
      this.w/2,  this.h/2, -this.l/2,

      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2,  this.h/2, -this.l/2, 
      this.w/2,  this.h/2, -this.l/2,
      -this.w/2,  this.h/2,  this.l/2, 
      this.w/2,  this.h/2, -this.l/2, 
      this.w/2,  this.h/2,  this.l/2,

      this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,
      this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2,  this.l/2, 
      this.w/2, -this.h/2,  this.l/2,
    ];
  }

}
