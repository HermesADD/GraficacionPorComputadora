class Cono {
  /**
   * Cono
   * @param {Number} radius el tamaño del cono
   * @param {Number} Nu número de particiones en paralelos
   * @param {Number} Nv número de particiones en meridianos
   */
  constructor(gl, radius=1, height=1, Nu=1, Nv=3, color="#ffffff", transform=identity()) {
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
    let phi; // la elevación en los paralelos
    let theta; // el ángulo en los meridianos
    
    // la punta del cono
    vertices.push(0, this.h/2, 0);

    // iteración para construir los paralelos
    for (let i=0; i<this.Nu+1; i++) {
      phi = (i+1)*(this.h/(this.Nu+1));

      // iteración para construir los meridianos
      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push( 
          (phi*this.r)/this.h * Math.cos(theta), 
          this.h/2 - phi, 
          (phi*this.r)/this.h * Math.sin(theta) 
        );
      }
    }

    return vertices;
  }

  getFaces() {
    let faces = [];

    // triángulos que utilizan la punta del cono (el vértice 0)
    for (let i=0; i<this.Nv; i++) {
      faces.push(
        0, // indice del polo norte
        (i%this.Nv)+1,
        ((i+1)%this.Nv)+1, 
      );
    }

    for (let i=0; i<this.Nu; i++) {
      for (let j=0; j<this.Nv; j++) {
        let v1 = j+1 + i*this.Nv;
        let v2 = (j+1)%this.Nv +1 + i*this.Nv;
        let v3 = (j+1)%this.Nv +1 + (i+1)*this.Nv;
        let v4 = j+1 + (i+1)*this.Nv;
      
        faces.push(v1, v2, v3); // Primer triángulo
        faces.push(v2, v3, v4); // Segundo triágulo
      }
    }
  
    return faces;
  }
}