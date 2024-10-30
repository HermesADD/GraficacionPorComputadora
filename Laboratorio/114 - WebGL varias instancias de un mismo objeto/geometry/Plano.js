class Plano {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl), transform=identity()) {
    this.material = material;
    this.transform = transform;

    let vertices = this.getVertices();

    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    //////////////////////////////////////////////////
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    if (this.material.getAttribute("a_texcoord") != undefined) {
      let uv = this.getUVCoordinates();
      let uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.material.getAttribute("a_texcoord"));
      gl.vertexAttribPointer(this.material.getAttribute("a_texcoord"), 2, gl.FLOAT, false, 0, 0);
    }

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


    gl.bindVertexArray(this.geometryVAO);
    gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   */
  getVertices() {
    return [
      1, 0,  1,
      1, 0, -1,
     -1, 0,  1,

     -1, 0,  1,
      1, 0, -1,
     -1, 0, -1, 
    ];
  }

  /**
   */
  getNormals() {
    return [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ];
  }
  /**
   */
  getUVCoordinates() {
    return [
      1, 0,
      1, 1,
      0, 0,

      0, 0,
      1, 1,
      0, 1, 
    ];
  }
}

