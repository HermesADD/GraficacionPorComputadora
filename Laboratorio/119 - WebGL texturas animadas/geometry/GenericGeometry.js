class GenericGeometry {
  constructor(gl, material, transform) {
    this.material = material;
    this.transform = transform;
  }

  /**
   */
  init(gl) {
    let positionAttributeLocation = gl.getAttribLocation(this.material.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.material.program, "a_normal");
    let texcoordAttributeLocation = gl.getAttribLocation(this.material.program, "a_texcoord");

    this.vertices = this.getVertices();

    if (this.getFaces) {
      this.faces = this.getFaces();

      this.createSmoothVAO(gl, positionAttributeLocation, normalAttributeLocation, texcoordAttributeLocation);
    }

    this.createFlatVAO(gl, positionAttributeLocation, normalAttributeLocation, texcoordAttributeLocation);
  }

  /**
   */
  createSmoothVAO(gl, positionAttributeLocation, normalAttributeLocation, texcoordAttributeLocation) {
    let normals = this.getSmoothNormals(this.vertices, this.faces);

    let uv;
    if (this.getUVCoordinates) {
      uv = this.getUVCoordinates(this.vertices);
    }

    this.smoothVAO = gl.createVertexArray();
    gl.bindVertexArray(this.smoothVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    //////////////////////////////////////////////////
    if (normalAttributeLocation >= 0) {
      let normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(normalAttributeLocation);
      gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }
    //////////////////////////////////////////////////

    //////////////////////////////////////////////////
    // Si el atributo tiene el valor de -1 significa que el programa (shaders) no cuenta con dicho atributo
    if ((uv != undefined) && (texcoordAttributeLocation >= 0)) {
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(texcoordAttributeLocation);
      gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
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
  createFlatVAO(gl, positionAttributeLocation, normalAttributeLocation, texcoordAttributeLocation) {
    let vertices;
    if (this.faces) {
      vertices = this.getFlatVertices(this.vertices, this.faces);
    }
    // Si no existe this.faces entonces la información contenida en this.vertices ya es correcta
    else {
      vertices = this.vertices;
    }

    let normals = this.getFlatNormals(vertices);

    let uv;
    if (this.getUVCoordinates) {
      uv = this.getUVCoordinates(vertices, true);
    }

    this.flatVAO = gl.createVertexArray();
    gl.bindVertexArray(this.flatVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    //////////////////////////////////////////////////
    if (normalAttributeLocation >= 0) {
      let normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(normalAttributeLocation);
      gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }
    //////////////////////////////////////////////////

    //////////////////////////////////////////////////
    // Si el atributo tiene el valor de -1 significa que el programa (shaders) no cuenta con dicho atributo
    if ((uv != undefined) && (texcoordAttributeLocation >= 0)) {
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(texcoordAttributeLocation);
      gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    }
    //////////////////////////////////////////////////


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_flat_elements = vertices.length/3;
  }


  /**
   */
  draw(gl, projectionMatrix, viewMatrix, light, delta) {
    gl.useProgram(this.material.program);

    let viewModelMatrix = multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);

    // u_VM_matrix
    if (this.material.getUniform("u_VM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix);
    }
    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }
    // u_delta
    if (this.material.getUniform("u_delta")) {
      gl.uniform1f(this.material.getUniform("u_delta"), delta);
    }

    ////////////////////////////////////////////////////////////
    // Componentes de la luz
    ////////////////////////////////////////////////////////////
    // u_light.position
    if (this.material.getUniform("u_light.position")) {
      gl.uniform3fv(this.material.getUniform("u_light.position"), light.getPosition());
    }
    // u_light.La
    if (this.material.getUniform("u_light.La")) {
      gl.uniform3fv(this.material.getUniform("u_light.La"), light.ambient);
    }
    // u_light.Ld
    if (this.material.getUniform("u_light.Ld")) {
      gl.uniform3fv(this.material.getUniform("u_light.Ld"), light.diffuse);
    }
    // u_light.Ls
    if (this.material.getUniform("u_light.Ls")) {
      gl.uniform3fv(this.material.getUniform("u_light.Ls"), light.especular);
    }
    ////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////
    // Componentes del material
    ////////////////////////////////////////////////////////////
    // u_material.Ka
    if (this.material.getUniform("u_material.Ka")) {
      gl.uniform3fv(this.material.getUniform("u_material.Ka"), this.material.Ka);
    }
    // u_material.Kd
    if (this.material.getUniform("u_material.Kd")) {
      gl.uniform3fv(this.material.getUniform("u_material.Kd"), this.material.Kd);
    }
    // u_material.Ks
    if (this.material.getUniform("u_material.Ks")) {
      gl.uniform3fv(this.material.getUniform("u_material.Ks"), this.material.Ks);
    }
    // u_material.shininess
    if (this.material.getUniform("u_material.shininess")) {
      gl.uniform1f(this.material.getUniform("u_material.shininess"), this.material.shininess);
    }
    // u_material.color
    if (this.material.getUniform("u_material.color")) {
      gl.uniform4fv(this.material.getUniform("u_material.color"), this.material.color);
    }
    // u_color
    if (this.material.getUniform("u_color")) {
      gl.uniform4fv(this.material.getUniform("u_color"), this.material.color);
    }
    // u_texture
    if (this.material.getUniform("u_texture")) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
    }
    // u_texture_1
    if (this.material.getUniform("u_texture_1")) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture_1);
      gl.uniform1i(this.material.getUniform("u_texture_1"), 0);
    }
    // u_texture_2
    if (this.material.getUniform("u_texture_2")) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture_2);
      gl.uniform1i(this.material.getUniform("u_texture_2"), 1);
    }
    // u_texture_3
    if (this.material.getUniform("u_texture_3")) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture_3);
      gl.uniform1i(this.material.getUniform("u_texture_3"), 2);
    }
    ////////////////////////////////////////////////////////////


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