class Esfera_smooth {
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
    this.normals = this.getNormals(this.vertices, this.faces);

    
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


    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    this.num_elements = this.faces.length;

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
    gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);
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

    for (let i=0; i<this.Nu-1; i++) {
      for (let j=0; j<this.Nv; j++) {
        // En la geometría original se tenia un cuadrilátero, pero para WebGL se necesitan triángulos entonces la cara se divide en dos triángulos
        // Hay que recordar que el orden de los vértices determina la dirección con la que se calcula la normal, ya que está se calcula por medio del producto cruz
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

    // como se están desempaquetando las coordenadas en tres elementos en el arreglo de vértices, el polo sur esta ubicado en el indice vertices.length/3-1; es decir, es necesario dividir entre tres
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
   */
  getNormals(vertices, faces) {
    let normals = new Array(vertices.length);
    normals.fill(0);

    let v1, v2, v3;
    let i1, i2, i3;
    let tmp;
    let n;

    for (let i=0; i<faces.length; i+=3) {
      i1 = faces[i  ]*3;
      i2 = faces[i+1]*3;
      i3 = faces[i+2]*3;

      v1 = { x: vertices[i1], y: vertices[i1 + 1], z: vertices[i1 + 2] };
      v2 = { x: vertices[i2], y: vertices[i2 + 1], z:vertices[i2 + 2] };
      v3 = { x: vertices[i3], y: vertices[i3 + 1], z: vertices[i3 + 2] };

      n = normalize(
        cross(subtract(v1, v2), subtract(v2, v3))
      );

      tmp = { x: normals[i1], y: normals[i1+1], z: normals[i1+2] };
      tmp = add(tmp, n);
      normals[i1  ] = tmp.x;
      normals[i1+1] = tmp.y;
      normals[i1+2] = tmp.z;


      tmp = { x: normals[i2], y: normals[i2+1], z: normals[i2+2] };
      tmp = add(tmp, n);
      normals[i2  ] = tmp.x;
      normals[i2+1] = tmp.y;
      normals[i2+2] = tmp.z;


      tmp = { x: normals[i3], y: normals[i3+1], z: normals[i3+2] };
      tmp = add(tmp, n);
      normals[i3  ] = tmp.x;
      normals[i3+1] = tmp.y;
      normals[i3+2] = tmp.z;
    }

    for (let i=0; i<normals.length; i+=3) {
      tmp = normalize({ x: normals[i], y: normals[i+1], z: normals[i+2] });
      normals[i  ] = tmp.x;
      normals[i+1] = tmp.y;
      normals[i+2] = tmp.z;
    }

    return normals;
  }
}
