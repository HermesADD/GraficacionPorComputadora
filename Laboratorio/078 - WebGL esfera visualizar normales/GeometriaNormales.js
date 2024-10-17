class GeometriaNormales {
  /**
   */
  constructor(gl, vertices, normals) {
      
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

    this.colorUniformLocation = gl.getUniformLocation(this.program, "u_color");
    this.PVM_matrixLocation = gl.getUniformLocation(this.program, "u_PVM_matrix");

    let positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");

    this.shapeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.shapeVAO);


    let normals_segments = [];

    for (let i=0; i<vertices.length; i+=3) {
      normals_segments.push(
        vertices[i],    // v.x
        vertices[i +1], // v.y
        vertices[i +2], // v.z

        vertices[i]    + normals[i],    // v.x + n.x
        vertices[i +1] + normals[i +1], // v.y + n.y
        vertices[i +2] + normals[i +2], // v.z + n.z
      );
    }

    let normalSegmentsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalSegmentsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals_segments), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    this.num_elements = normals_segments.length/3;

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   */
  update(transform) {
    this.transform = transform;
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix) {
    gl.useProgram(this.program);

    // VM_matrixLocation
    let viewModelMatrix = multiply(viewMatrix, this.transform);
    gl.uniformMatrix4fv(this.VM_matrixLocation, true, viewModelMatrix);

    // PVM_matrixLocation
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);
    gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix);

    // u_color
    gl.uniform4fv(this.colorUniformLocation, [0.0, 0.0, 0.0, 1.0]);


    gl.bindVertexArray(this.shapeVAO);
    gl.drawArrays(gl.LINES, 0, this.num_elements);
    gl.bindVertexArray(null);
  }

}
