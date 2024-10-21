class GenericGeometry{
  constructor(gl,material,transform){
    this.material = material;
    this.transform=transform;
  }

  init(gl){
    let positionAttributeLocation = gl.getAttribLocation(this.material.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.material.program, "a_normal");

    this.vertices = this.getVertices();
    this.faces = this.getFaces();

    this.createFlatVAO(gl, positionAttributeLocation, normalAttributeLocation);
  }

  draw(gl, projectionMatrix, viewMatrix, light) {
    gl.useProgram(this.material.program);
  
    // u_VM_matrix (matriz de vista-modelo)
    let viewModelMatrix = Matrix4.multiply(viewMatrix, this.transform);
    if (this.material.getUniform("u_VM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_VM_matrix"), true, viewModelMatrix.toArray());
    }
  
    // u_PVM_matrix (matriz de proyección-vista-modelo)
    let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
    if (this.material.getUniform("u_PVM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix.toArray());
    }
  
    ////////////////////////////////////////////////////////////
    // Luz y materiales - Parámetros ambientales
    // u_Ka - coeficiente de reflexión ambiental
    if (this.material.getUniform("u_Ka")) {
      gl.uniform3fv(this.material.getUniform("u_Ka"), this.material.Ka || [0.1, 0.1, 0.1]);
    }
  
    // u_La - color ambiental de la luz
    if (this.material.getUniform("u_La")) {
      gl.uniform3fv(this.material.getUniform("u_La"), light.ambient || [1, 1, 1]);
    }
  
    ////////////////////////////////////////////////////////////
    // Componentes difusos
    // u_Kd - coeficiente de reflexión difusa (color de la figura)
    if (this.material.getUniform("u_Kd")) {
      gl.uniform3fv(this.material.getUniform("u_Kd"), this.material.Kd);
    }
  
    // u_Ld - color difuso de la luz
    if (this.material.getUniform("u_Ld")) {
      gl.uniform3fv(this.material.getUniform("u_Ld"), light.diffuse || [1, 1, 1]);
    }
  
    ////////////////////////////////////////////////////////////
    // Componentes especulares
    // u_shininess - brillo especular
    if (this.material.getUniform("u_shininess")) {
      gl.uniform1f(this.material.getUniform("u_shininess"), this.material.shininess || 5.0);
    }
  
    // u_Ks - coeficiente de reflexión especular
    if (this.material.getUniform("u_Ks")) {
      gl.uniform3fv(this.material.getUniform("u_Ks"), this.material.Ks || [1, 1, 1]);
    }
  
    // u_Ls - color especular de la luz
    if (this.material.getUniform("u_Ls")) {
      gl.uniform3fv(this.material.getUniform("u_Ls"), light.specular || [1, 1, 1]);
    }
  
    ////////////////////////////////////////////////////////////
    // Posición de la luz
    if (this.material.getUniform("u_light_position")) {
      gl.uniform3fv(this.material.getUniform("u_light_position"), light.pos || [0, 5, 0]);
    }
  
    gl.bindVertexArray(this.flatVAO);
    gl.drawArrays(gl.TRIANGLES, 0, this.num_flat_elements);
    gl.bindVertexArray(null);
  }
  

  createFlatVAO(gl, positionAttributeLocation, normalAttributeLocation) {
    let vertices;
    if (this.faces) {
      vertices = this.getFlatVertices(this.vertices, this.faces);
    }
    // Si no existe this.faces entonces la información contenida en this.vertices ya es correcta
    else {
      vertices = this.vertices;
    }

    let normals = this.getFlatNormals(vertices);

    this.flatVAO = gl.createVertexArray();
    gl.bindVertexArray(this.flatVAO);

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    // Si el atributo tiene el valor de -1 significa que el programa (shaders) no cuenta con dicho atributo
    if (normalAttributeLocation >= 0) {
      let normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(normalAttributeLocation);
      gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }
    //////////////////////////////////////////////////

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.num_flat_elements = vertices.length/3;
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

    for (let i = 0; i < vertices.length; i += 9) {
      v1 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
      v2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]); 
      v3 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]); // Intercambiado
  
      // Calcula la normal usando el producto cruzado
      n = Vector3.cross(Vector3.subtract(v1, v2), Vector3.subtract(v2, v3)).normalize();
  
      // Repite la normal para cada vértice del triángulo
      normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);
    }

    return normals;
  }
}