class Plano {
  /**
   */
  constructor(gl, material=new FlatMaterial(gl), transform=identity()) {
    this.material = material;
    this.transform = transform;

    let vertices = this.getVertices();
    let normals = this.getNormals();
    let uvs = this.getUVCoordinates();
    let [tangents, bitangents] = this.getTangentBitangent(vertices, normals, uvs);

    // El Vertex Array Object del plano
    this.geometryVAO = gl.createVertexArray();
    gl.bindVertexArray(this.geometryVAO);

    //////////////////////////////////////////////////
    // El buffer de posiciones
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_position"));
    gl.vertexAttribPointer(this.material.getAttribute("a_position"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    // El buffer de normales
    let normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_normal"));
    gl.vertexAttribPointer(this.material.getAttribute("a_normal"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    // El buffer de tangentes
    let tangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_tangent"));
    gl.vertexAttribPointer(this.material.getAttribute("a_tangent"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    // El buffer de bitangentes
    let bitangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bitangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.material.getAttribute("a_bitangent"));
    gl.vertexAttribPointer(this.material.getAttribute("a_bitangent"), 3, gl.FLOAT, false, 0, 0);

    //////////////////////////////////////////////////
    // El buffer de coordenadas de textura
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
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

    // u_M_matrix
    if (this.material.getUniform("u_M_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_M_matrix"), true, this.transform);
    }

    // u_PVM_matrix
    if (this.material.getUniform("u_PVM_matrix") != undefined) {
      gl.uniformMatrix4fv(this.material.getUniform("u_PVM_matrix"), true, projectionViewModelMatrix);
    }

    // u_light_position
    if (this.material.getUniform("u_light_position") != undefined) {
      gl.uniform3fv(this.material.getUniform("u_light_position"), [light.position.x, light.position.y, light.position.z]);
    }

    // u_texture
    if (this.material.getUniform("u_texture") != undefined) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
      gl.uniform1i(this.material.getUniform("u_texture"), 0);
    }
    // u_texture_normal
    if (this.material.getUniform("u_texture_normal") != undefined) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.material.normal_texture);
      gl.uniform1i(this.material.getUniform("u_texture_normal"), 1);
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

  /**
   * Se calcula el espacio tangente a las caras del modelo, esto es necesario para saber como se van a modificar las normales, respecto a la textura de normales que se está utilizando
   */
  getTangentBitangent(vertices, normals, uvs) {
    // El espacio tangente es un espacio que se forma a partir de la tangente a una cara, la normal a esa cara y un vector binormal que se calcula como el producto cruz de la tangente y la normal; este espacio es un espacio de referencia visto desde la orientación de la cara del modelo, por lo que cada cara necesita tener su propio conjunto de vectores tangente, normal y bitangente
    // https://es.wikipedia.org/wiki/Espacio_tangente
    //////////////////////////////////////////////////////////////////
    // delta_pos_1 = delta_uv1.x * T + delta_uv1.y * B
    // delta_pos_2 = delta_uv2.x * T + delta_uv2.y * B
    //////////////////////////////////////////////////////////////////
    let v0, v1, v2;
    let uv0, uv1, uv2;
    let delta_pos_1, delta_pos_2;
    let delta_uv_1, delta_uv_2;
    let r, denominador;
    let tangent, bitangent;
    let tangents = [];
    let bitangents = [];

    // Se itera sobre grupos de tres vértices, ya que estos forman un triángulo
    for (let i=0; i<vertices.length/3; i+=3) {
      // el primer vertices del triángulo
      v0 = { x:vertices[i*3], y:vertices[i*3 +1], z:vertices[i*3 +2] };
      // el segundo vertices del triángulo
      v1 = { x:vertices[(i+1)*3], y:vertices[(i+1)*3 +1], z:vertices[(i+1)*3 +2] };
      // el tercer vertices del triángulo
      v2 = { x:vertices[(i+2)*3], y:vertices[(i+2)*3 +1], z:vertices[(i+2)*3 +2] };

      // Se construyen los vectores correspondientes que contienen la posición de las coordenadas UV
      uv0 = { x:uvs[i*2],     y:uvs[i*2 +1],     z:0 };
      uv1 = { x:uvs[(i+1)*2], y:uvs[(i+1)*2 +1], z:0 };
      uv2 = { x:uvs[(i+2)*2], y:uvs[(i+2)*2 +1], z:0 };

      // Se calculan dos vectores de dirección que se encuentran sobre el plano definido por la cara
      delta_pos_1 = subtract(v1, v0);
      delta_pos_2 = subtract(v2, v0);

      // Se calculan dos vectores de dirección que se encuentran sobre el plano uv
      delta_uv_1 = subtract(uv1, uv0);
      delta_uv_2 = subtract(uv2, uv0);

      // se calcula el vector tangente como:
      // T = (delta_pos_1 * delta_uv_2.y - delta_pos_2 * delta_uv_1.y) / (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
      // y el vector bitangente como:
      // B = (delta_pos_2 * delta_uv_1.x - delta_pos_1 * delta_uv_2.x) / (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
      denominador = (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
      r = (denominador <= 0.000001) ? 1 : (1/denominador);

      tangent = normalize(
        multiplyEscalar(
          subtract( 
            multiplyEscalar(delta_pos_1, delta_uv_2.y),
            multiplyEscalar(delta_pos_2, delta_uv_1.y),
          ),
          r
        )
      );

      bitangent = normalize(
        multiplyEscalar(
          subtract( 
            multiplyEscalar(delta_pos_2, delta_uv_1.x),
            multiplyEscalar(delta_pos_1, delta_uv_2.x),
          ),
          r
        )
      );

      // Se almacenan los valores de los vectores tangente y bitangente en los arreglos correspondientes
      tangents.push(
        tangent.x, tangent.y, tangent.z,
        tangent.x, tangent.y, tangent.z,
        tangent.x, tangent.y, tangent.z,
      );
      bitangents.push(
        bitangent.x, bitangent.y, bitangent.z,
        bitangent.x, bitangent.y, bitangent.z,
        bitangent.x, bitangent.y, bitangent.z,
      );
    }

    //////////////////////////////////////////////////////////////////
    // Por último se ortonormalizan los vectores utilizando el proceso de ortogonalización de Gram-Schmidt
    // https://es.wikipedia.org/wiki/Proceso_de_ortogonalizaci%C3%B3n_de_Gram-Schmidt
    // T - N*(N·T)
    //////////////////////////////////////////////////////////////////
    let tmp, tmp_T, tmp_N;
    for (let i=0, l=tangents.length/3; i<l; i++) {
      tmp_T = { x:tangents[i*3], y:tangents[i*3 +1], z:tangents[i*3 +2] };
      tmp_N = { x:normals[i*3],  y:normals[i*3 +1],  z:normals[i*3 +2]  };
      tmp = normalize(
        subtract(
          tmp_T,
          multiplyEscalar(
            tmp_N,
            dot(tmp_N, tmp_T),
          )
        )
      );
      tangents[i*3] = tmp.x;
      tangents[i*3 +1] = tmp.y;
      tangents[i*3 +2] = tmp.z;
    }

    return [tangents, bitangents];
  }
}

