class OBJGeometry {
  /**
   * 
   */
  constructor(gl, obj_data, material=new PhongMaterial(gl), transform=identity()) {
    this.material = material;
    this.transform = transform;
    this.material_library = obj_data.material_library;
    this.group_faces = obj_data.group_faces;

    let positionAttributeLocation = gl.getAttribLocation(this.material.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.material.program, "a_normal");

    // Se crea el Vertex Array Object
    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    // Se crea el buffer de datos para las posiciones
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj_data.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    // Si el .obj tiene información de las normales se crea el buffer correspondiente
    if (obj_data.normals.length > 0) {
      this.normalsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj_data.normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(normalAttributeLocation);
      gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
    // Componentes de la luz
    ////////////////////////////////////////////////////////////
    // u_light.position
    if (this.material.getUniform("u_light.position") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.position"), light.getPosition());
    }
    // u_light.La
    if (this.material.getUniform("u_light.La") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.La"), light.ambient);
    }
    // u_light.Ld
    if (this.material.getUniform("u_light.Ld") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.Ld"), light.diffuse);
    }
    // u_light.Ls
    if (this.material.getUniform("u_light.Ls") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light.Ls"), light.especular);
    }
    ////////////////////////////////////////////////////////////

    let current_material;

    // Se dibuja el objeto por grupos para enviar los valores correctos del material asociado
    for (let i=0, l=this.group_faces.length; i<l; i++) {
      current_material = this.material_library[this.group_faces[i].mat_name];

      // Si no existen el material en el objeto material_library, se usa el material asignado cuando se construyó el modelo
      if (current_material == undefined) {
        current_material = this.material;
      }

      ////////////////////////////////////////////////////////////
      // Componentes del material
      ////////////////////////////////////////////////////////////
      // u_material.Ka
      if (this.material.getUniform("u_material.Ka") != undefined) {
        gl.uniform3fv(this.material.getUniform("u_material.Ka"), current_material.Ka);
      }
      // u_material.Kd
      if (this.material.getUniform("u_material.Kd") != undefined) {
        gl.uniform3fv(this.material.getUniform("u_material.Kd"), current_material.Kd);
      }
      // u_material.Ks
      if (this.material.getUniform("u_material.Ks") != undefined) {
        gl.uniform3fv(this.material.getUniform("u_material.Ks"), current_material.Ks);
      }
      // u_material.shininess
      if (this.material.getUniform("u_material.shininess") != undefined) {
        gl.uniform1f(this.material.getUniform("u_material.shininess"), current_material.shininess);
      }
      ////////////////////////////////////////////////////////////

      gl.bindVertexArray(this.geometryVAO);

      // Solo se dibujan los elementos desde el vértice inicial, hasta el número de elementos de cada grupo
      gl.drawArrays(
        gl.TRIANGLES, 
        this.group_faces[i].initial_index*3, 
        this.group_faces[i].num_elements*3
      );
      gl.bindVertexArray(null);
    }
  }
}
