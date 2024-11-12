class GenericGeometry {
  constructor(gl, material, transform) {
    this.material = material;
    this.transform = transform;
  }

  /**
   */
  init(gl) {
    this.vertices = this.getVertices();

    if (this.getFaces) {
      this.faces = this.getFaces();
      this.createSmoothVAO(gl);
    }

    this.createFlatVAO(gl);
  }

  /**
   */
  createSmoothVAO(gl) {
    this.smoothVAO = gl.createVertexArray();
    gl.bindVertexArray(this.smoothVAO);

    //////////////////////////////////////////////////
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    if (this.material.getAttribute("a_normal") != undefined) {
      let normals = this.getSmoothNormals(this.vertices, this.faces);
      let normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_normal"));
      gl.vertexAttribPointer(this.material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
    }

    // Las coordenadas baricéntricas 
    if (this.material.getAttribute("a_barycentric") != undefined) {
      let barycentric = this.getBarycentric(this.vertices);
      let barycentricBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_barycentric"));
      gl.vertexAttribPointer(this.material.getAttribute("a_barycentric"), 3, gl.FLOAT, false, 0, 0);
    }


    //////////////////////////////////////////////////
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    this.num_smooth_elements = this.faces.length;
  }

  /**
   */
  createFlatVAO(gl) {
    let vertices = (this.faces) ? this.getFlatVertices(this.vertices, this.faces) : this.vertices;

    this.flatVAO = gl.createVertexArray();
    gl.bindVertexArray(this.flatVAO);

    //////////////////////////////////////////////////
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    if (this.material.getAttribute("a_normal") != undefined) {
      let normals = this.getFlatNormals(vertices);
      let normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_normal"));
      gl.vertexAttribPointer(this.material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);
    }

    // Las coordenadas baricéntricas 
    if (this.material.getAttribute("a_barycentric") != undefined) {
      let barycentric = this.getBarycentric(vertices);
      let barycentricBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, barycentricBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barycentric), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_barycentric"));
      gl.vertexAttribPointer(this.material.getAttribute("a_barycentric"), 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.num_flat_elements = vertices.length/3;
  }

  /**
   * Las coordenadas baricéntricas son valores asignados a cada vértice de un triángulo (por ejemplo, (1,0,0), (0,1,0), (0,0,1)) y serán interpoladas en el shader de fragments
   * Estos valores indican la cercanía de un fragmento a los bordes del triángulo: cuanto más cerca esté un fragmento de un borde, una de las componentes será cercana a cero
   */
  getBarycentric(position) {
    const count = position.length / 9;
    const barycentric = [];

    for (let i=0; i < count; i++) {
      barycentric.push(
        0, 0, 1, 
        0, 1, 0, 
        1, 0, 0
      );
    }

    return barycentric;
  }


  /**
   */
  draw(gl, projectionMatrix, viewMatrix, light) {
    let viewModelMatrix = multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);

    gl.useProgram(this.material.program);

    // u_VM_matrix
    if (this.material.getUniform("u_VM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix);
    }

    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    ////////////////////////////////////////////////////////////
    // Componentes ambientales
    // u_Ka
    if (this.material.getUniform("u_Ka") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_Ka"), this.material.Ka);
    }
    // u_La
    if (this.material.getUniform("u_La") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_La"), light.ambient);
    }
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // Componentes difusos
    // u_Kd
    if (this.material.getUniform("u_Kd") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_Kd"), this.material.Kd);
    }
    // u_Ld
    if (this.material.getUniform("u_Ld") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_Ld"), light.diffuse);
    }
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // Componentes especulares
    // u_shininess
    if (this.material.getUniform("u_shininess") != undefined) {
      gl.uniform1f(this.material.getUniform("u_shininess"), this.material.shininess);
    }
    // u_Ks
    if (this.material.getUniform("u_Ks") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_Ks"), this.material.Ks);
    }
    // u_Ls
    if (this.material.getUniform("u_Ls") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_Ls"), light.especular);
    }
    ////////////////////////////////////////////////////////////


    // u_color
    if (this.material.getUniform("u_color") != undefined) {
      gl.uniform4fv(this.material.getUniform("u_color"), this.material.color);
    }

    // u_light_position
    if (this.material.getUniform("u_light_position") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light_position"), light.position);
    }

    // Smooth shading
    if (this.isSmooth && this.getFaces) {
      gl.bindVertexArray(this.smoothVAO);
      gl.drawElements(gl.TRIANGLES, this.num_smooth_elements, gl.UNSIGNED_SHORT, 0);
    }
    // Flat shading
    else {
      gl.bindVertexArray(this.flatVAO);
      gl.drawArrays(gl.TRIANGLES, 0, this.num_flat_elements);
    }

    gl.bindVertexArray(null);
  }

  /**
   */
  getSmoothNormals(vertices, faces) {
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


  /**
   */
  getFlatVertices(vertices, faces) {
    let flat_vertices = [];

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
  getFlatNormals(vertices) {
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