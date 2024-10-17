class Toroide {
  /**
   * Toroide
   * @param {Number} major_radius el radio mayor del toroide
   * @param {Number} major_radius el radio menor del toroide
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, major_radius=1, minor_radius=1, Nu=1, Nv=3, color="#ffffff", transform=identity()) {
    this.R = major_radius;
    this.r = minor_radius;
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
    let vertices = [];

    for (let i=0; i<this.Nv+1; i++) {
      for (let j=0; j<this.Nu; j++) {
        vertices.push(
          -(this.R + this.r * Math.sin(2*Math.PI*j/this.Nu)) * Math.sin(2*Math.PI*i/this.Nv),
            this.r * Math.cos(2*Math.PI*j/this.Nu),
           (this.R + this.r * Math.sin(2*Math.PI*j/this.Nu)) * Math.cos(2*Math.PI*i/this.Nv),
        );
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nv; i++) {
      for (let j=0; j<this.Nu; j++) {
        let v1 = j +i*this.Nu;
        let v2 = j +(i+1)*this.Nu;
        let v3 = (j+1)%this.Nu +(i+1)*this.Nu;
        let v4 = (j+1)%this.Nu +i*this.Nu;
        
        // Dividimos el cuadrado en dos triángulos (sin cruzarlos)
        faces.push(v1, v2, v3);  // Primer triángulo
        faces.push(v1, v3, v4);  // Segundo triángulo
      }
    }
  
    return faces;
  }
}