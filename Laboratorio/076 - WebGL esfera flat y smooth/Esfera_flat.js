class Esfera_flat {
  /**
   */
  constructor(gl, radius=1, Nu=8, Nv=8, color="#ffffff", transform=identity()) {
    this.r = radius;
    this.Nu = Nu;
    this.Nv = Nv;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();

    // La geometría de la esfera se tiene especificada por medio de indices, por lo que cada vértice se especifica de forma única
    // Para dibujar una esfera con caras planas (flat shading) es necesario expandir la indexación creando copias de los vértices y utilizar esos vértices para crear las normales y los buffers de datos
    this.vertices = this.getFlatVertices(this.vertices, this.faces);
    this.normals = this.getNormals(this.vertices);

    
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;

    void main() {
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;

    uniform vec3 u_light_position;
    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      vec3 to_light = normalize( u_light_position - v_position );

      vec3 fragment_normal = normalize(v_normal);

      float cos_angle = max(dot(fragment_normal, to_light), 0.0);

      pixelColor = vec4(vec3(u_color) * cos_angle, u_color.a);
    }`;

    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    let positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.program, "a_normal");

    this.colorUniformLocation = gl.getUniformLocation(this.program, "u_color");
    this.lightUniformLocation = gl.getUniformLocation(this.program, "u_light_position");
    this.PVM_matrixLocation = gl.getUniformLocation(this.program, "u_PVM_matrix");
    this.VM_matrixLocation = gl.getUniformLocation(this.program, "u_VM_matrix");


    this.shapeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.shapeVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    //////////////////////////////////////////////////
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    //////////////////////////////////////////////////


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_elements = this.vertices.length/3;

    this.theta = 0;
  }

  /**
   */
  update(elapsed) {
    this.transform = rotateY(this.theta += elapsed);
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix, lightPosition) {
    gl.useProgram(this.program);

    // VM_matrixLocation
    let viewModelMatrix = multiply(viewMatrix, this.transform);
    gl.uniformMatrix4fv(this.VM_matrixLocation, true, viewModelMatrix);

    // PVM_matrixLocation
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);
    gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix);

    // u_color
    gl.uniform4fv(this.colorUniformLocation, this.color);

    // u_light_position
    gl.uniform3fv(this.lightUniformLocation, [lightPosition.x, lightPosition.y, lightPosition.z]);


    gl.bindVertexArray(this.shapeVAO);
    gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    gl.bindVertexArray(null);
  }

  /**
   */
  getVertices() {
    let vertices = [];
    let phi;
    let theta;
    
    vertices.push(0, this.r, 0);

    for (let i=0; i<this.Nu; i++) {
      phi = Math.PI/2 - (i+1)*(Math.PI/(this.Nu+1));

      for (let j=0; j<this.Nv; j++) {
        theta = j*(2*Math.PI/this.Nv);

        vertices.push(
          this.r * Math.cos(phi) * Math.cos(theta), 
          this.r * Math.sin(phi), 
          this.r * Math.cos(phi) * Math.sin(theta) 
        );
      }
    }

    vertices.push(0, -this.r, 0);

    return vertices;
  }

  /**
   */
  getFaces() {
    let faces = [];

    for (let i=0; i<this.Nv; i++) {
      faces.push(
        0,
        ((i+1)%this.Nv)+1, 
        (i%this.Nv)+1,
      );
    }

    for (let i=0; i<this.Nu; i++) {
      for (let j=0; j<this.Nv; j++) {
        faces.push( 
          // triángulo 1
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,

          // triángulo 2
          j+1 + i*this.Nv,
          (j+1)%this.Nv +1 + (i+1)*this.Nv,
          j+1 + (i+1)*this.Nv,
        );
      }
    }

    for (let i=0; i<this.Nv; i++) {
      faces.push(
        this.vertices.length/3-1, 
        this.vertices.length/3-1 -this.Nv +i, 
        this.vertices.length/3-1 -this.Nv +((i+1)%this.Nv)
      );
    }
  
    return faces;
  }

  /**
   * 
   */
  getFlatVertices(vertices, faces) {
    // Arreglo para almacenar todos los vértices que definen la geometría
    let flat_vertices = [];

    // Cada indice almacenado en el arreglo de caras define un vértice, así que iterando de cara en cara (de índice en índice) se obtienen las coordenadas x, y, y z del vértice y se agregan al nuevo arreglo
    for (let i=0, l=faces.length; i<l; i++) {
      flat_vertices.push(
        vertices[faces[i]*3],    // x
        vertices[faces[i]*3 +1], // y
        vertices[faces[i]*3 +2], // z
      );
    }

    return flat_vertices;
  }

  /**
   */
  getNormals(vertices) {
    let normals = [];
    let v1, v2, v3;
    let n;

    for (let i=0; i<vertices.length; i+=9) {
      v1 = { x: vertices[i  ], y: vertices[i+1], z: vertices[i+2] };
      v2 = { x: vertices[i+3], y: vertices[i+4], z: vertices[i+5] };
      v3 = { x: vertices[i+6], y: vertices[i+7], z: vertices[i+8] };

      n = normalize(
        cross(subtract(v1, v2), subtract(v2, v3))
      );

      normals.push(
        n.x, n.y, n.z, 
        n.x, n.y, n.z, 
        n.x, n.y, n.z
      );
    }

    return normals;
  }
}
