class Dodecaedro {
  /**
   * Dodecaedro
   * @param {Number} width el tamaño del dodecaedro
   */
  constructor(gl, width=1, color="#ffffff", transform=identity()) {
    this.w = width;
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
  }

  draw(gl, projectionViewMatrix, wireframe) {
    gl.useProgram(this.program);

    let projectionViewModelMatrix = Matrix4.multiply(projectionViewMatrix, this.transform);

    if(!wireframe){
      gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix.toArray());
      gl.uniform4fv(this.colorUniformLocation, this.color);

      gl.bindVertexArray(this.shapeVAO);
      gl.drawElements(gl.TRIANGLE_FAN, this.num_elements, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    }else{
      gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix.toArray());
      gl.uniform4fv(this.colorUniformLocation,[0,0,0,1]);

      gl.bindVertexArray(this.shapeVAO);
      gl.drawElements(gl.LINE_LOOP, this.num_elements, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    }
  }

  getVertices() {
    const goldenRatio = 1.6180339887;
    let width_d_goldenRatio = this.w/goldenRatio;
    let width_m_goldenRatio = this.w*goldenRatio;

    return [
      this.w, this.w, this.w , 
      this.w, this.w,-this.w , 
      this.w,-this.w, this.w , 
      this.w,-this.w,-this.w , 
     -this.w, this.w, this.w , 
     -this.w, this.w,-this.w , 
     -this.w,-this.w, this.w , 
     -this.w,-this.w,-this.w , 
      0, width_d_goldenRatio, width_m_goldenRatio,
      0, width_d_goldenRatio,-width_m_goldenRatio, 
      0,-width_d_goldenRatio, width_m_goldenRatio, 
      0,-width_d_goldenRatio,-width_m_goldenRatio, 
      width_d_goldenRatio, width_m_goldenRatio, 0, 
      width_d_goldenRatio,-width_m_goldenRatio, 0, 
     -width_d_goldenRatio, width_m_goldenRatio, 0, 
     -width_d_goldenRatio,-width_m_goldenRatio, 0, 
      width_m_goldenRatio, 0, width_d_goldenRatio, 
      width_m_goldenRatio, 0, -width_d_goldenRatio, 
     -width_m_goldenRatio, 0, width_d_goldenRatio, 
     -width_m_goldenRatio, 0,-width_d_goldenRatio 
    ];
  }

  getFaces() {
    return [
      // Cara 1 (pentágono original: 0, 16, 2, 10, 8)
      0, 16, 8, 
      0, 8, 10, 
      0, 10, 2, 

      // Cara 2 (pentágono original: 12, 1, 17, 16, 0)
      12, 1, 0, 
      12, 0, 16, 
      12, 16, 17, 

      // Cara 3 (pentágono original: 8, 4, 14, 12, 0)
      8, 4, 0, 
      0, 4, 12, 
      4, 14, 12, 

      // Cara 4 (pentágono original: 2, 16, 17, 3, 13)
      2, 16, 17, 
      2, 17, 3, 
      2, 3, 13, 

      // Cara 5 (pentágono original: 13, 15, 6, 10, 2)
      13, 15, 2, 
      2, 15, 10, 
      15, 6, 10,

      // Cara 6 (pentágono original: 6, 18, 4, 8, 10)
      6, 18, 10, 
      10, 18, 8, 
      18, 4, 8, 

      // Cara 7 (pentágono original: 3, 17, 1, 9, 11)
      3, 17, 11, 
      17, 1, 9, 
      17, 9, 11, 

      // Cara 8 (pentágono original: 13, 3, 11, 7, 15)
      13, 3, 11, 
      13, 11, 7, 
      13, 7, 15, 

      // Cara 9 (pentágono original: 1, 12, 14, 5, 9)
      1, 12, 9, 
      12, 14, 5, 
      12, 5, 9, 

      // Cara 10 (pentágono original: 11, 9, 5, 19, 7)
      11, 9, 7, 
      9, 5, 19, 
      9, 19, 7, 

      // Cara 11 (pentágono original: 5, 14, 4, 18, 19)
      5, 14, 18, 
      5, 18, 19, 
      14, 4, 18,

      // Cara 12 (pentágono original: 6, 15, 7, 19, 18)
      6, 15, 18, 
      15, 7, 19, 
      15, 19, 18
    ];
  }
}