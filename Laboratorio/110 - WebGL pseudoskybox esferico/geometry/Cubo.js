class Cubo {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl), transform=identity()) {
    this.material = material;
    this.transform = transform;

    let vertices = this.getVertices();
    let uv = this.getUVCoordinates();

    let positionAttributeLocation = gl.getAttribLocation(this.material.program, "a_position");
    let texcoordAttributeLocation = gl.getAttribLocation(this.material.program, "a_texcoord");

    // El Vertex Array Object
    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    // El buffer de posiciones
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    // El buffer de coordenadas de textura
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texcoordAttributeLocation);
    // hay que notar que como las coordenadas UV son bidimensionales, el número de elementos indicados es 2 (segundo parámetro)
    gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

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
      // Se indica el indice de la textura activa, en este caso el uniforme u_texture se asocia con la textura 0; para cada textura que se vaya a utilizar es necesario tener un uniforme y asociar correctamente el indice de las texturas
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
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
