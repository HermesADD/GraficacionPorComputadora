class Skybox {
  /**
   */
  constructor(gl, material=new SkyboxMaterial(gl), transform=identity()) {
    this.material = material;
    this.transform = transform;

    let vertices = this.getVertices();

    let positionAttributeLocation = gl.getAttribLocation(this.material.program, "a_position");

    // El Vertex Array Object
    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    // El buffer de posiciones
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    this.num_elements = vertices.length/3;
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix, light) {
    gl.useProgram(this.material.program);

    let viewModelMatrix = multiply(viewMatrix, this.transform);
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);

    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix")) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    // u_texture
    if (this.material.getUniform("u_texture")) {
      gl.activeTexture(gl.TEXTURE0);
      // es importante utilizar el tipo correcto de textura, en este caso TEXTURE_CUBE_MAP, de lo contrario el sampler del shader de fragmentos no accederá correctamente a la textura
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
    }
    ////////////////////////////////////////////////////////////

    gl.bindVertexArray(this.geometryVAO);
    gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);

    gl.bindVertexArray(null);
    // se libera la textura activa
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
}
