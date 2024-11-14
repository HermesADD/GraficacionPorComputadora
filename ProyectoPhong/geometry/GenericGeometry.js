class GenericGeometry{
  constructor(gl,material,transform){
    this.material = material;
    this.transform=transform;
  }

  /**
   * Método que inicializa los buffers para vértices, normales y coordenadas UV
   * @param  gl Contexto WebGL
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
   * Método que crea un VAO para renderizar la geometría con sombreado suave.
   * @param gl Contexto WebGL
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

    //////////////////////////////////////////////////
    if ((this.getUVCoordinates) && (this.material.getAttribute("a_texcoord") != undefined)) {
      let uv = this.getUVCoordinates(this.vertices);
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
      gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
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
   * Método que crea un VAO para renderizar la geometría con sombreado plano.
   * @param gl Contexto WebGL
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

    //////////////////////////////////////////////////
    if ((this.getUVCoordinates) && (this.material.getAttribute("a_texcoord") != undefined)) {
      let uv = this.getUVCoordinates(vertices, true);
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
      gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
    }

    //////////////////////////////////////////////////
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_flat_elements = vertices.length/3;
  }


  /**
   * Método que dibuja la geometría con sombreado plano o suave.
   * @param  gl Contexto WebGL
   * @param  projectionMatrix Matriz de proyección
   * @param  viewMatrix Matriz de vista
   * @param  light Parametros de la luz(posición,colores ambiente/difuso/especular)
   */
  draw(gl, projectionMatrix, viewMatrix, light) {
    let viewModelMatrix = Matrix4.multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix); 

    gl.useProgram(this.material.program);

    // u_VM_matrix
    if (this.material.getUniform("u_VM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix.toArray());
    }
    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix.toArray());
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

    ////////////////////////////////////////////////////////////
    // Componentes del material
    ////////////////////////////////////////////////////////////
    // u_material.Ka
    if (this.material.getUniform("u_material.Ka") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_material.Ka"), this.material.Ka);
    }
    // u_material.Kd
    if (this.material.getUniform("u_material.Kd") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_material.Kd"), this.material.Kd);
    }
    // u_material.Ks
    if (this.material.getUniform("u_material.Ks") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_material.Ks"), this.material.Ks);
    }
    // u_material.shininess
    if (this.material.getUniform("u_material.shininess") != undefined) {
      gl.uniform1f(this.material.getUniform("u_material.shininess"), this.material.shininess);
    }
    // u_material.color
    if (this.material.getUniform("u_material.color") != undefined) {
      gl.uniform4fv(this.material.getUniform("u_material.color"), this.material.color);
    }
    // u_color
    if (this.material.getUniform("u_color") != undefined) {
      gl.uniform4fv(this.material.getUniform("u_color"), this.material.color);
    }
    // u_texture
    if (this.material.getUniform("u_texture") != undefined) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
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
   * Método que calcula normales suaves
   * @param vertices Lista de vértices 
   * @param faces Lista de caras
   * @returns Arreglo de normales suaves
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

      v1 = new Vector3(vertices[i1], vertices[i1 + 1], vertices[i1 + 2]);
      v2 = new Vector3(vertices[i2], vertices[i2 + 1], vertices[i2 + 2]);
      v3 = new Vector3(vertices[i3], vertices[i3 + 1], vertices[i3 + 2]);

      n = (Vector3.cross(Vector3.subtract(v1, v2), Vector3.subtract(v2, v3))).normalize();

      tmp = new Vector3(normals[i1], normals[i1+1], normals[i1+2]);
      tmp = Vector3.add(tmp, n);
      normals[i1  ] = tmp.x;
      normals[i1+1] = tmp.y;
      normals[i1+2] = tmp.z;


      tmp = new Vector3(normals[i2], normals[i2+1], normals[i2+2]);
      tmp = Vector3.add(tmp, n);
      normals[i2  ] = tmp.x;
      normals[i2+1] = tmp.y;
      normals[i2+2] = tmp.z;


      tmp = new Vector3(normals[i3], normals[i3+1], normals[i3+2]);
      tmp = Vector3.add(tmp, n);
      normals[i3  ] = tmp.x;
      normals[i3+1] = tmp.y;
      normals[i3+2] = tmp.z;
    }

    for (let i=0; i<normals.length; i+=3) {
      tmp = new Vector3(normals[i], normals[i+1], normals[i+2]).normalize();
      normals[i  ] = tmp.x;
      normals[i+1] = tmp.y;
      normals[i+2] = tmp.z;
    }

    return normals;
  }

  /**
   * Método que genera arreglo de vértices duplicados para cada triángulo
   * @param vertices Lista de vértices 
   * @param faces Lista de caras
   * @returns Arreglo de vértices para sombreado plano
   */
  getFlatVertices(vertices, faces) {
    let flat_vertices = [];
    this.flat_uv = [];

    for (let i=0, l=faces.length; i<l; i++) {
      flat_vertices.push(
        vertices[faces[i]*3],    // x
        vertices[faces[i]*3 +1], // y
        vertices[faces[i]*3 +2], // z
      );
      if (this.smooth_uv) {
        this.flat_uv.push(
          this.smooth_uv[faces[i]*2], // u
          this.smooth_uv[faces[i]*2 +1], // v
        );
      }
    }

    return flat_vertices;
  }

  /**
   * Método que calcula normales planas
   * @param vertices Lista de vértices 
   * @returns Arreglo de normales planas
   */
  getFlatNormals(vertices) {
    let normals = [];
    let v1, v2, v3;
    let n;

    for (let i=0; i<vertices.length; i+=9) {
      v1 = new Vector3(vertices[i  ], vertices[i+1], vertices[i+2]);
      v2 = new Vector3(vertices[i+3], vertices[i+4], vertices[i+5]);
      v3 = new Vector3(vertices[i+6], vertices[i+7], vertices[i+8]);

      n = (Vector3.cross(Vector3.subtract(v1, v2), Vector3.subtract(v2, v3))).normalize();

      normals.push(
        n.x, n.y, n.z, 
        n.x, n.y, n.z, 
        n.x, n.y, n.z
      );
    }

    return normals;
  }
}