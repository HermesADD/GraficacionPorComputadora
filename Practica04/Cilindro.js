class Cilindro {
  /**
   * Cilindro
   * @param {Number} radius el tamaño del cilindro
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius=1, height=1, Nu=1, Nv=3, color="#ffffff", transform=Matrix4.identity()) {
    this.r = radius;
    this.h = height;
    this.Nu = Nu;
    this.Nv = Nv;
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
    let edges = [];
    // Conexiones horizontales (a lo largo de los paralelos)
    for (let i = 0; i < this.Nu; i++) {
      for (let j = 0; j < this.Nv; j++) {
        let curr = i * this.Nv + j;                   // Índice del vértice actual
        let next = i * this.Nv + (j + 1) % this.Nv;   // Índice del siguiente vértice en el paralelo
        let below = (i + 1) * this.Nv + j;            // Índice del vértice directamente debajo
        let belowNext = (i + 1) * this.Nv + (j + 1) % this.Nv; // Vértice diagonal en el siguiente paralelo
  
        // Aristas horizontales y verticales
        edges.push(curr, next);        // Arista horizontal superior
        edges.push(curr, below);       // Arista vertical izquierda
        edges.push(below, belowNext);  // Arista horizontal inferior
        edges.push(next, belowNext);   // Arista vertical derecha
  
        // Aristas diagonales para formar los dos triángulos del cuadrado
        edges.push(curr, belowNext);   // Diagonal del primer triángulo
      }
    }

    // se crea un nuevo buffer de datos para almacenar los indices de las aristas
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edges), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.num_wireframe_elements = edges.length;
  }

  draw(gl, projectionViewMatrix){
    gl.useProgram(this.program);
    let projectionViewModelMatrix = Matrix4.multiply(projectionViewMatrix, this.transform);

    gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix.toArray());
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

  getVertices() {
    let vertices = [];
    let phi; // la elevación en los paralelos
    let theta; // el ángulo en los meridianos
    
    // iteración para construir los paralelos
    for (let i=0; i<this.Nu+2; i++) {
      phi = i*(this.h/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push( 
          this.r * Math.cos(theta), 
          this.h/2 - phi, 
          this.r * Math.sin(theta) 
        );
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nu+1; i++) {
      for (let j=0; j<this.Nv; j++) {
      
        let v1 = j + i * this.Nv;
        let v2 = (j + 1) % this.Nv + i * this.Nv;
        let v3 = (j + 1) % this.Nv + (i + 1) * this.Nv;
        let v4 = j + (i + 1) * this.Nv;
        faces.push([v1,v2,v3]);
        faces.push([v2,v3,v4]);
      }
    }
  
    return faces;
  }
}