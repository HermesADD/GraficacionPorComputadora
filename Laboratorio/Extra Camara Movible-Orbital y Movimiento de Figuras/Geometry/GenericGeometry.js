class GenericGeometry {
  constructor(gl, material, transform) {
    this.material = material;
    this.transform = transform;
  
  }

  init(gl) {
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
    this.vertices = this.getFlatVertices(this.vertices, this.faces);
    
    let positionAttributeLocation = gl.getAttribLocation(this.material.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.material.program, "a_normal");
    this.createFlatFacesVAO(gl, positionAttributeLocation, normalAttributeLocation);
  }

  createFlatFacesVAO(gl, positionAttributeLocation, normalAttributeLocation) {
    this.normals = this.getFlatNormals(this.vertices);

    this.flatVAO = gl.createVertexArray();
    gl.bindVertexArray(this.flatVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    // Si el atributo tiene el valor de -1 significa que el programa (shaders) no cuenta con dicho atributo
    if (normalAttributeLocation >= 0) {
      let normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(normalAttributeLocation);
      gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_flat_elements = this.vertices.length/3;

    

    // Se crea geometría para mostrar las normales del objeto 
    this.flat_faces_geometry = new GeometriaNormales(gl, this.vertices, this.normals);
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix, lightPosition, light) {

    gl.useProgram(this.material.program);


    // u_VM_matrix
    let viewModelMatrix = multiply(viewMatrix, this.transform);
    if (this.material.getUniform("u_VM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix);
    }

    // u_PVM_matrix
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);
    if (this.material.getUniform("u_PVM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    // Componentes ambientales
    // u_Ka
    if (this.material.getUniform("u_Ka")) {
      gl.uniform3fv(this.material.getUniform("u_Ka"), this.material.ka);
    }
    // u_La
    if (this.material.getUniform("u_La")) {
      gl.uniform3fv(this.material.getUniform("u_La"), light.ambient);
    }
  
    // Componentes difusos
    // u_Kd
    if (this.material.getUniform("u_Kd")) {
      gl.uniform3fv(this.material.getUniform("u_Kd"), this.material.kd);
    }
    // u_Ld
    if (this.material.getUniform("u_Ld")) {
      gl.uniform3fv(this.material.getUniform("u_Ld"), light.diffuse);
    }
   
    // Componentes especulares
    // u_alpha
    if (this.material.getUniform("u_alpha")) {
      gl.uniform1f(this.material.getUniform("u_alpha"), this.material.alpha);
    }
    // u_Ks
    if (this.material.getUniform("u_Ks")) {
      gl.uniform3fv(this.material.getUniform("u_Ks"), this.material.ks);
    }
    // u_Ls
    if (this.material.getUniform("u_Ls")) {
      gl.uniform3fv(this.material.getUniform("u_Ls"), light.specular);
    }
   
     // u_color
     if (this.material.getUniform("u_color")) {
      gl.uniform4fv(this.material.getUniform("u_color"), this.material.color);
    }

     // u_light_position
    // se verifica si existe el uniforme

    if (this.material.getUniform("u_light_position")) {
      gl.uniform3fv(this.material.getUniform("u_light_position"), lightPosition);
    }

    gl.bindVertexArray(this.flatVAO);

    gl.drawArrays(gl.TRIANGLES,0, this.num_flat_elements);
  
    gl.bindVertexArray(null);

    //this.flat_faces_geometry.draw(gl, projectionMatrix, viewMatrix);

  }

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