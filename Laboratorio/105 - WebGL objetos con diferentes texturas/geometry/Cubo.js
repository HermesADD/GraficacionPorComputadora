class Cubo {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl), transform=identity()) {
    this.material = material;
    this.transform = transform;

    let vertices = this.getVertices();
    let uv = this.getUVCoordinates();

    // El Vertex Array Object
    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    // El buffer de posiciones
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    // El buffer de coordenadas de textura
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
    gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    this.num_elements = vertices.length/3;
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix, light) {
    let viewModelMatrix = multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);

    gl.useProgram(this.material.program);

    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    // u_texture
    if (this.material.getUniform("u_texture") != undefined) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
    }


    gl.bindVertexArray(this.geometryVAO);
    gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   */
  getVertices() {
    return [
       1,  1,  1, 
       1, -1,  1, 
      -1, -1,  1, 
       1,  1,  1, 
      -1, -1,  1, 
      -1,  1,  1, 

       1,  1, -1, 
       1, -1, -1, 
       1, -1,  1, 
       1,  1, -1, 
       1, -1,  1, 
       1,  1,  1, 
 
      -1,  1, -1, 
      -1, -1, -1, 
       1, -1, -1, 
      -1,  1, -1, 
       1, -1, -1, 
       1,  1, -1, 

      -1,  1,  1, 
      -1, -1,  1, 
      -1, -1, -1, 
      -1,  1,  1, 
      -1, -1, -1, 
      -1,  1, -1,
  
       1, -1,  1, 
       1, -1, -1, 
      -1, -1, -1, 
       1, -1,  1, 
      -1, -1, -1, 
      -1, -1,  1, 

       1,  1, -1, 
       1,  1,  1, 
      -1,  1,  1, 
       1,  1, -1, 
      -1,  1,  1,
      -1,  1, -1, 
    ];
  }

  /**
   */
  getUVCoordinates() {
    return [
      0.5,  0.625, 
      0.5,  0.375, 
      0.25, 0.375, 
      0.5,  0.625, 
      0.25, 0.375, 
      0.25, 0.625, 

      0.75, 0.625, 
      0.75, 0.375, 
      0.5,  0.375, 
      0.75, 0.625, 
      0.5,  0.375, 
      0.5,  0.625, 

      1,    0.625, 
      1,    0.375, 
      0.75, 0.375, 
      1,    0.625, 
      0.75, 0.375, 
      0.75, 0.625, 

      0.25, 0.625, 
      0.25, 0.375, 
      0,    0.375, 
      0.25, 0.625, 
      0,    0.375, 
      0,    0.625, 

      0.5,  0.375, 
      0.5,  0.125, 
      0.25, 0.125, 
      0.5,  0.375, 
      0.25, 0.125, 
      0.25, 0.375, 

      0.5,  0.875, 
      0.5,  0.625, 
      0.25, 0.625, 
      0.5,  0.875, 
      0.25, 0.625, 
      0.25, 0.875, 
    ];
  }
}
