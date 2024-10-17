class Icosaedro {
  /**
   * Icosaedro
   * @param {Number} width el tamaño del icosaedro
   */
  constructor(gl, width=1, color="#ffffff", transform=Matrix4.identity()) {
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
      gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);
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
    //width_m_goldenRatio
    let wmg = this.w*goldenRatio;

    return [
      0, this.w, wmg, 
      0, this.w,-wmg, 
      0,-this.w, wmg, 
      0,-this.w,-wmg, 
      this.w, wmg, 0, 
      this.w,-wmg, 0, 
     -this.w, wmg, 0, 
     -this.w,-wmg, 0, 
      wmg, 0, this.w, 
      wmg, 0,-this.w, 
     -wmg, 0, this.w, 
     -wmg, 0,-this.w 
    ];
  }

  getFaces() {
    return [
      0, 0, 2, 
      0, 8, 2, 
      8, 5, 2, 
      5, 7, 2, 
      7, 10, 2, 
      6, 0, 10, 
      11, 6, 10, 
      7, 11, 10, 
      7, 3, 11, 
      5, 3, 7, 
      9, 3, 5, 
      8, 9, 5, 
      4, 9, 8, 
      0, 4, 8, 
      6, 4, 0, 
      11, 3, 1, 
      6, 11, 1, 
      4, 6, 1, 
      9, 4, 1, 
      3, 9, 1,
    ]
  }
}