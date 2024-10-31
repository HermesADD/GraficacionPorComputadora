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
    let uvsAttributeLocation = gl.getAttribLocation(this.material.program, "a_texcoord");

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

    // Si el .obj tiene información de las coordenadas de textura se crea el buffer correspondiente
    if (obj_data.uvs.length > 0) {
      this.uvsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj_data.uvs), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(uvsAttributeLocation);
      gl.vertexAttribPointer(uvsAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // valores del material a texturas
    for (let mat in this.material_library) {
      mat = this.material_library[mat];

      // Ka
      if (mat.map_Ka) {
        mat.KaTexture = this.makeImageTexture(gl, mat.map_Ka);
      }
      else {
        mat.KaTexture = this.makeColorTexture(gl, [mat.Ka[0]*255, mat.Ka[1]*255, mat.Ka[2]*255, 255]);
      }

      // Kd
      if (mat.map_Kd) {
        mat.KdTexture = this.makeImageTexture(gl, mat.map_Kd);
      }
      else {
        mat.KdTexture = this.makeColorTexture(gl, [mat.Kd[0]*255, mat.Kd[1]*255, mat.Kd[2]*255, 255]);
      }

      // Ks
      if (mat.map_Ks) {
        mat.KsTexture = this.makeImageTexture(gl, mat.map_Ks);
      }
      else {
        mat.KsTexture = this.makeColorTexture(gl, [mat.Ks[0]*255, mat.Ks[1]*255, mat.Ks[2]*255, 255]);
      }

      // Ns
      if (mat.map_Ns) {
        mat.NsTexture = this.makeImageTexture(gl, mat.map_Ns);
      }
      else {
        mat.NsTexture = this.makeColorTexture(gl, [mat.shininess, 0, 0, 255]);
      }

      // map_Bump
      if (mat.map_Bump) {
        mat.BumpTexture = this.makeImageTexture(gl, mat.map_Bump);
        mat.UseBumpTexture = true;
      }

    }
  }

  /**
   */
  makeColorTexture(gl, color) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(color)
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }
  /**
   */
  makeImageTexture(gl, image) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
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
      if (this.material.getUniform("u_material.Ka_texture") != undefined) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, current_material.KaTexture);
        gl.uniform1i(this.material.getUniform("u_material.Ka_texture"), 0);
      }
      // u_material.Kd_texture
      if (this.material.getUniform("u_material.Kd_texture") != undefined) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, current_material.KdTexture);
        gl.uniform1i(this.material.getUniform("u_material.Kd_texture"), 1);
      }
      // u_material.Ks_texture
      if (this.material.getUniform("u_material.Ks_texture") != undefined) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, current_material.KsTexture);
        gl.uniform1i(this.material.getUniform("u_material.Ks_texture"), 2);
      }
      // u_material.Ns_texture
      if (this.material.getUniform("u_material.Ns_texture") != undefined) {
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, current_material.NsTexture);
        gl.uniform1i(this.material.getUniform("u_material.Ns_texture"), 3);
      }
      // u_material.Ns_texture
      if (this.material.getUniform("u_material.useNormalMap") != undefined) {
        gl.uniform1i(this.material.getUniform("u_material.useNormalMap"), current_material.UseBumpTexture ? 1 : 0);

        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, current_material.BumpTexture);
        gl.uniform1i(this.material.getUniform("u_material.NormalMap"), 4);
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
