class Teapot {
  /**
   */
  constructor(gl, color="#ffffff", transform=identity()) {
    this.color = color;

    this.transform = transform;
    
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;

    void main() {
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;

    uniform vec3 u_light_position;
    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      vec3 to_light = normalize( u_light_position - v_position );

      vec3 fragment_normal = normalize(v_normal);

      float cos_angle = max(dot(fragment_normal, to_light), 0.0);

      pixelColor = vec4(vec3(u_color) * cos_angle, u_color.a);
    }`;


    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    this.colorUniformLocation = gl.getUniformLocation(this.program, "u_color");
    this.lightUniformLocation = gl.getUniformLocation(this.program, "u_light_position");
    this.PVM_matrixLocation = gl.getUniformLocation(this.program, "u_PVM_matrix");
    this.VM_matrixLocation = gl.getUniformLocation(this.program, "u_VM_matrix");

    let positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.program, "a_normal");


    this.vertices = this.getVertices();
    this.faces = this.getFaces();


    this.createSmoothVAO(gl, positionAttributeLocation, normalAttributeLocation);

    this.createFlatVAO(gl, positionAttributeLocation, normalAttributeLocation);

    this.theta = 0;
  }

  /**
   */
  createSmoothVAO(gl, positionAttributeLocation, normalAttributeLocation) {
    let normals = this.getSmoothNormals(this.vertices, this.faces);


    this.smoothVAO = gl.createVertexArray();
    gl.bindVertexArray(this.smoothVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    //////////////////////////////////////////////////
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    //////////////////////////////////////////////////


    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    this.num_smooth_elements = this.faces.length;

    this.smooth_normal_geometry = new GeometriaNormales(gl, this.vertices, normals);
  }

  /**
   */
  createFlatVAO(gl, positionAttributeLocation, normalAttributeLocation) {
    let vertices = this.getFlatVertices(this.vertices, this.faces);
    let normals = this.getFlatNormals(vertices);


    this.flatVAO = gl.createVertexArray();
    gl.bindVertexArray(this.flatVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    //////////////////////////////////////////////////
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    //////////////////////////////////////////////////


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_flat_elements = vertices.length/3;

    this.flat_normal_geometry = new GeometriaNormales(gl, vertices, normals);
  }

  /**
   */
  update(elapsed) {
    this.transform = rotateY(this.theta += elapsed);

    this.smooth_normal_geometry.update(this.transform);
    this.flat_normal_geometry.update(this.transform);
  }

  /**
   */
  draw(gl, projectionMatrix, viewMatrix, lightPosition) {
    gl.useProgram(this.program);

    // VM_matrixLocation
    let viewModelMatrix = multiply(viewMatrix, this.transform);
    gl.uniformMatrix4fv(this.VM_matrixLocation, true, viewModelMatrix);

    // PVM_matrixLocation
    let projectionViewModelMatrix = multiply(projectionMatrix, viewModelMatrix);
    gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewModelMatrix);

    // u_color
    gl.uniform4fv(this.colorUniformLocation, this.color);

    // u_light_position
    gl.uniform3fv(this.lightUniformLocation, [lightPosition.x, lightPosition.y, lightPosition.z]);

    // Smooth shading
    if (this.isSmooth) {
      gl.bindVertexArray(this.smoothVAO);
      gl.drawElements(gl.TRIANGLES, this.num_smooth_elements, gl.UNSIGNED_SHORT, 0);
    }
    // Flat shading
    else {
      gl.bindVertexArray(this.flatVAO);
      gl.drawArrays(gl.TRIANGLES, 0, this.num_flat_elements);
    }

    gl.bindVertexArray(null);

    // Se dibujan las normales
    if (this.drawNormals) {
      if (this.isSmooth) {
        this.smooth_normal_geometry.draw(gl, projectionMatrix, viewMatrix);
      }
      else {
        this.flat_normal_geometry.draw(gl, projectionMatrix, viewMatrix);
      }
    }
  }

  /**
   */
  getVertices() {
    return [
      0.588750, 1.289506, 1.383750, 0.568818, 1.363334, 1.336904, 0.000000, 1.363334, 1.449219, 0.000000, 1.289506, 1.500000, 0.550727, 1.387943, 1.294383, 0.000000, 1.387943, 1.403125, 0.541834, 1.363334, 1.273482, 0.000000, 1.363334, 1.380469, 0.549500, 1.289506, 1.291500, 0.000000, 1.289506, 1.400000, 1.065000, 1.289506, 1.065000, 1.028945, 1.363334, 1.028945, 0.996219, 1.387943, 0.996219, 0.980133, 1.363334, 0.980133, 0.994000, 1.289506, 0.994000, 1.383750, 1.289506, 0.588750, 1.336904, 1.363334, 0.568818, 1.294383, 1.387943, 0.550727, 1.273482, 1.363334, 0.541834, 1.291500, 1.289506, 0.549500, 1.500000, 1.289506, 0.000000, 1.449219, 1.363334, 0.000000, 1.403125, 1.387943, 0.000000, 1.380469, 1.363334, 0.000000, 1.400000, 1.289506, 0.000000, -1.383750, 1.289506, 0.588750, -1.336904, 1.363334, 0.568818, -1.449219, 1.363334, 0.000000, -1.500000, 1.289506, 0.000000, -1.294383, 1.387943, 0.550727, -1.403125, 1.387943, 0.000000, -1.273482, 1.363334, 0.541834, -1.380469, 1.363334, 0.000000, -1.291500, 1.289506, 0.549500, -1.400000, 1.289506, 0.000000, -1.065000, 1.289506, 1.065000, -1.028945, 1.363334, 1.028945, -0.996219, 1.387943, 0.996219, -0.980133, 1.363334, 0.980133, -0.994000, 1.289506, 0.994000, -0.588750, 1.289506, 1.383750, -0.568818, 1.363334, 1.336904, -0.550727, 1.387943, 1.294383, -0.541834, 1.363334, 1.273482, -0.549500, 1.289506, 1.291500, -0.588750, 1.289506, -1.383750, -0.568818, 1.363334, -1.336904, 0.000000, 1.363334, -1.449219, 0.000000, 1.289506, -1.500000, -0.550727, 1.387943, -1.294383, 0.000000, 1.387943, -1.403125, -0.541834, 1.363334, -1.273482, 0.000000, 1.363334, -1.380469, -0.549500, 1.289506, -1.291500, 0.000000, 1.289506, -1.400000, -1.065000, 1.289506, -1.065000, -1.028945, 1.363334, -1.028945, -0.996219, 1.387943, -0.996219, -0.980133, 1.363334, -0.980133, -0.994000, 1.289506, -0.994000, -1.383750, 1.289506, -0.588750, -1.336904, 1.363334, -0.568818, -1.294383, 1.387943, -0.550727, -1.273482, 1.363334, -0.541834, -1.291500, 1.289506, -0.549500, 1.383750, 1.289506, -0.588750, 1.336904, 1.363334, -0.568818, 1.294383, 1.387943, -0.550727, 1.273482, 1.363334, -0.541834, 1.291500, 1.289506, -0.549500, 1.065000, 1.289506, -1.065000, 1.028945, 1.363334, -1.028945, 0.996219, 1.387943, -0.996219, 0.980133, 1.363334, -0.980133, 0.994000, 1.289506, -0.994000, 0.588750, 1.289506, -1.383750, 0.568818, 1.363334, -1.336904, 0.550727, 1.387943, -1.294383, 0.541834, 1.363334, -1.273482, 0.549500, 1.289506, -1.291500, 0.785000, -0.210495, 1.845000, 0.768135, 0.139896, 1.805361, 0.000000, 0.139896, 1.957031, 0.000000, -0.210495, 2.000000, 0.723672, 0.511380, 1.700859, 0.000000, 0.511380, 1.843750, 0.660810, 0.896927, 1.553115, 0.000000, 0.896927, 1.683594, 1.420000, -0.210495, 1.420000, 1.389492, 0.139896, 1.389492, 1.309063, 0.511380, 1.309063, 1.195352, 0.896927, 1.195352, 1.845000, -0.210495, 0.785000, 1.805361, 0.139896, 0.768135, 1.700859, 0.511380, 0.723672, 1.553115, 0.896927, 0.660810, 2.000000, -0.210495, 0.000000, 1.957031, 0.139896, 0.000000, 1.843750, 0.511380, 0.000000, 1.683594, 0.896927, 0.000000, -1.845000, -0.210495, 0.785000, -1.805361, 0.139896, 0.768135, -1.957031, 0.139896, 0.000000, -2.000000, -0.210495, 0.000000, -1.700859, 0.511380, 0.723672, -1.843750, 0.511380, 0.000000, -1.553115, 0.896927, 0.660810, -1.683594, 0.896927, 0.000000, -1.420000, -0.210495, 1.420000, -1.389492, 0.139896, 1.389492, -1.309063, 0.511380, 1.309063, -1.195352, 0.896927, 1.195352, -0.785000, -0.210495, 1.845000, -0.768135, 0.139896, 1.805361, -0.723672, 0.511380, 1.700859, -0.660810, 0.896927, 1.553115, -0.785000, -0.210495, -1.845000, -0.768135, 0.139896, -1.805361, 0.000000, 0.139896, -1.957031, 0.000000, -0.210495, -2.000000, -0.723672, 0.511380, -1.700859, 0.000000, 0.511380, -1.843750, -0.660810, 0.896927, -1.553115, 0.000000, 0.896927, -1.683594, -1.420000, -0.210495, -1.420000, -1.389492, 0.139896, -1.389492, -1.309063, 0.511380, -1.309063, -1.195352, 0.896927, -1.195352, -1.845000, -0.210495, -0.785000, -1.805361, 0.139896, -0.768135, -1.700859, 0.511380, -0.723672, -1.553115, 0.896927, -0.660810, 1.845000, -0.210495, -0.785000, 1.805361, 0.139896, -0.768135, 1.700859, 0.511380, -0.723672, 1.553115, 0.896927, -0.660810, 1.420000, -0.210495, -1.420000, 1.389492, 0.139896, -1.389492, 1.309063, 0.511380, -1.309063, 1.195352, 0.896927, -1.195352, 0.785000, -0.210495, -1.845000, 0.768135, 0.139896, -1.805361, 0.723672, 0.511380, -1.700859, 0.660810, 0.896927, -1.553115, 0.588750, -0.960495, 1.383750, 0.619414, -0.874948, 1.455820, 0.000000, -0.874948, 1.578125, 0.000000, -0.960495, 1.500000, 0.686875, -0.726120, 1.614375, 0.000000, -0.726120, 1.750000, 0.754336, -0.506979, 1.772930, 0.000000, -0.506979, 1.921875, 1.065000, -0.960495, 1.065000, 1.120469, -0.874948, 1.120469, 1.242500, -0.726120, 1.242500, 1.364531, -0.506979, 1.364531, 1.383750, -0.960495, 0.588750, 1.455820, -0.874948, 0.619414, 1.614375, -0.726120, 0.686875, 1.772930, -0.506979, 0.754336, 1.500000, -0.960495, 0.000000, 1.578125, -0.874948, 0.000000, 1.750000, -0.726120, 0.000000, 1.921875, -0.506979, 0.000000, -1.383750, -0.960495, 0.588750, -1.455820, -0.874948, 0.619414, -1.578125, -0.874948, 0.000000, -1.500000, -0.960495, 0.000000, -1.614375, -0.726120, 0.686875, -1.750000, -0.726120, 0.000000, -1.772930, -0.506979, 0.754336, -1.921875, -0.506979, 0.000000, -1.065000, -0.960495, 1.065000, -1.120469, -0.874948, 1.120469, -1.242500, -0.726120, 1.242500, -1.364531, -0.506979, 1.364531, -0.588750, -0.960495, 1.383750, -0.619414, -0.874948, 1.455820, -0.686875, -0.726120, 1.614375, -0.754336, -0.506979, 1.772930, -0.588750, -0.960495, -1.383750, -0.619414, -0.874948, -1.455820, 0.000000, -0.874948, -1.578125, 0.000000, -0.960495, -1.500000, -0.686875, -0.726120, -1.614375, 0.000000, -0.726120, -1.750000, -0.754336, -0.506979, -1.772930, 0.000000, -0.506979, -1.921875, -1.065000, -0.960495, -1.065000, -1.120469, -0.874948, -1.120469, -1.242500, -0.726120, -1.242500, -1.364531, -0.506979, -1.364531, -1.383750, -0.960495, -0.588750, -1.455820, -0.874948, -0.619414, -1.614375, -0.726120, -0.686875, -1.772930, -0.506979, -0.754336, 1.383750, -0.960495, -0.588750, 1.455820, -0.874948, -0.619414, 1.614375, -0.726120, -0.686875, 1.772930, -0.506979, -0.754336, 1.065000, -0.960495, -1.065000, 1.120469, -0.874948, -1.120469, 1.242500, -0.726120, -1.242500, 1.364531, -0.506979, -1.364531, 0.588750, -0.960495, -1.383750, 0.619414, -0.874948, -1.455820, 0.686875, -0.726120, -1.614375, 0.754336, -0.506979, -1.772930, -2.953125, 0.689505, 0.168750, -2.862549, 0.929337, 0.168750, -2.906250, 0.949662, 0.000000, -3.000000, 0.689505, 0.000000, -2.591797, 1.052494, 0.168750, -2.625000, 1.083255, 0.000000, -2.142334, 1.097867, 0.168750, -2.156250, 1.132474, 0.000000, -1.515625, 1.104349, 0.168750, -1.500000, 1.139506, 0.000000, -2.850000, 0.689505, 0.225000, -2.766406, 0.884623, 0.225000, -2.518750, 0.984818, 0.225000, -2.111719, 1.021732, 0.225000, -1.550000, 1.027006, 0.225000, -2.746875, 0.689505, 0.168750, -2.670264, 0.839908, 0.168750, -2.445703, 0.917142, 0.168750, -2.081104, 0.945597, 0.168750, -1.584375, 0.949662, 0.168750, -2.700000, 0.689505, 0.000000, -2.626563, 0.819584, 0.000000, -2.412500, 0.886381, 0.000000, -2.067188, 0.910990, 0.000000, -1.600000, 0.914506, 0.000000, -2.746875, 0.689505, -0.168750, -2.670264, 0.839908, -0.168750, -2.445703, 0.917142, -0.168750, -2.081104, 0.945597, -0.168750, -1.584375, 0.949662, -0.168750, -2.850000, 0.689505, -0.225000, -2.766407, 0.884623, -0.225000, -2.518750, 0.984818, -0.225000, -2.111719, 1.021732, -0.225000, -1.550000, 1.027006, -0.225000, -2.953125, 0.689505, -0.168750, -2.862549, 0.929337, -0.168750, -2.591797, 1.052494, -0.168750, -2.142334, 1.097867, -0.168750, -1.515625, 1.104349, -0.168750, -1.915625, -0.463619, 0.168750, -2.377661, -0.206814, 0.168750, -2.388281, -0.243893, 0.000000, -1.900000, -0.510494, 0.000000, -2.700977, 0.077347, 0.168750, -2.731250, 0.047318, 0.000000, -2.890991, 0.379307, 0.168750, -2.933594, 0.359623, 0.000000, -1.950000, -0.360494, 0.225000, -2.354297, -0.125241, 0.225000, -2.634375, 0.143412, 0.225000, -2.797266, 0.422611, 0.225000, -1.984375, -0.257370, 0.168750, -2.330933, -0.043667, 0.168750, -2.567773, 0.209476, 0.168750, -2.703540, 0.465915, 0.168750, -2.320312, -0.006588, 0.000000, -2.537500, 0.239506, 0.000000, -2.660938, 0.485599, 0.000000, -1.984375, -0.257370, -0.168750, -2.330933, -0.043667, -0.168750, -2.567773, 0.209476, -0.168750, -2.703540, 0.465915, -0.168750, -1.950000, -0.360494, -0.225000, -2.354297, -0.125241, -0.225000, -2.634375, 0.143412, -0.225000, -2.797266, 0.422611, -0.225000, -1.915625, -0.463619, -0.168750, -2.377661, -0.206814, -0.168750, -2.700977, 0.077347, -0.168750, -2.890991, 0.379307, -0.168750, 3.206250, 1.289506, 0.140625, 2.810059, 0.901835, 0.176660, 2.867188, 0.881693, 0.000000, 3.300000, 1.289506, 0.000000, 2.640625, 0.388920, 0.255938, 2.687500, 0.333255, 0.000000, 2.377441, -0.091476, 0.335215, 2.414063, -0.187057, 0.000000, 1.700000, -0.381588, 0.371250, 1.700000, -0.510494, 0.000000, 3.000000, 1.289506, 0.187500, 2.684375, 0.946146, 0.235547, 2.537500, 0.511381, 0.341250, 2.296875, 0.118802, 0.446953, 1.700000, -0.097994, 0.495000, 2.793750, 1.289506, 0.140625, 2.558692, 0.990458, 0.176660, 2.434375, 0.633841, 0.255938, 2.216309, 0.329081, 0.335215, 1.700000, 0.185599, 0.371250, 2.700000, 1.289506, 0.000000, 2.501563, 1.010599, 0.000000, 2.387500, 0.689505, 0.000000, 2.179688, 0.424662, 0.000000, 1.700000, 0.314505, 0.000000, 2.793750, 1.289506, -0.140625, 2.558692, 0.990458, -0.176660, 2.434375, 0.633841, -0.255938, 2.216309, 0.329081, -0.335215, 1.700000, 0.185599, -0.371250, 3.000000, 1.289506, -0.187500, 2.684375, 0.946146, -0.235547, 2.537500, 0.511381, -0.341250, 2.296875, 0.118802, -0.446953, 1.700000, -0.097995, -0.495000, 3.206250, 1.289506, -0.140625, 2.810059, 0.901835, -0.176660, 2.640625, 0.388919, -0.255938, 2.377441, -0.091476, -0.335215, 1.700000, -0.381588, -0.371250, 3.137500, 1.289506, 0.084375, 3.272717, 1.347266, 0.093164, 3.352735, 1.350150, 0.000000, 3.200000, 1.289506, 0.000000, 3.333887, 1.363553, 0.112500, 3.428125, 1.366849, 0.000000, 3.314050, 1.342817, 0.131836, 3.414453, 1.344877, 0.000000, 3.000000, 1.289506, 0.112500, 3.096680, 1.340922, 0.124219, 3.126563, 1.356302, 0.150000, 3.093164, 1.338285, 0.175781, 2.862500, 1.289506, 0.084375, 2.920642, 1.334577, 0.093164, 2.919238, 1.349051, 0.112500, 2.872278, 1.333753, 0.131836, 2.800000, 1.289506, 0.000000, 2.840625, 1.331693, 0.000000, 2.825000, 1.345755, 0.000000, 2.771875, 1.331693, 0.000000, 2.862500, 1.289506, -0.084375, 2.920642, 1.334577, -0.093164, 2.919238, 1.349051, -0.112500, 2.872278, 1.333753, -0.131836, 3.000000, 1.289506, -0.112500, 3.096680, 1.340922, -0.124219, 3.126562, 1.356302, -0.150000, 3.093164, 1.338285, -0.175781, 3.137500, 1.289506, -0.084375, 3.272717, 1.347266, -0.093164, 3.333887, 1.363553, -0.112500, 3.314050, 1.342817, -0.131836, 0.078500, 1.589506, 0.184500, 0.077392, 1.723099, 0.181657, 0.000000, 1.723099, 0.196875, 0.000000, 1.589506, 0.200000, 0.127879, 1.870756, 0.299918, 0.000000, 1.870756, 0.325000, 0.134051, 1.990287, 0.314345, 0.000000, 1.990287, 0.340625, 0.000000, 2.039505, 0.000000, 0.142000, 1.589506, 0.142000, 0.139887, 1.723099, 0.139887, 0.231031, 1.870756, 0.231031, 0.242160, 1.990287, 0.242160, 0.184500, 1.589506, 0.078500, 0.181657, 1.723099, 0.077392, 0.299918, 1.870756, 0.127879, 0.314345, 1.990287, 0.134051, 0.200000, 1.589506, 0.000000, 0.196875, 1.723099, 0.000000, 0.325000, 1.870756, 0.000000, 0.340625, 1.990287, 0.000000, -0.184500, 1.589506, 0.078500, -0.181657, 1.723099, 0.077392, -0.196875, 1.723099, 0.000000, -0.200000, 1.589506, 0.000000, -0.299918, 1.870756, 0.127879, -0.325000, 1.870756, 0.000000, -0.314345, 1.990287, 0.134051, -0.340625, 1.990287, 0.000000, -0.142000, 1.589506, 0.142000, -0.139887, 1.723099, 0.139887, -0.231031, 1.870756, 0.231031, -0.242160, 1.990287, 0.242160, -0.078500, 1.589506, 0.184500, -0.077392, 1.723099, 0.181657, -0.127879, 1.870756, 0.299918, -0.134051, 1.990287, 0.314345, -0.078500, 1.589506, -0.184500, -0.077392, 1.723099, -0.181657, 0.000000, 1.723099, -0.196875, 0.000000, 1.589506, -0.200000, -0.127879, 1.870756, -0.299918, 0.000000, 1.870756, -0.325000, -0.134051, 1.990287, -0.314345, 0.000000, 1.990287, -0.340625, -0.142000, 1.589506, -0.142000, -0.139887, 1.723099, -0.139887, -0.231031, 1.870756, -0.231031, -0.242160, 1.990287, -0.242160, -0.184500, 1.589506, -0.078500, -0.181657, 1.723099, -0.077392, -0.299918, 1.870756, -0.127879, -0.314345, 1.990287, -0.134051, 0.184500, 1.589506, -0.078500, 0.181657, 1.723099, -0.077392, 0.299918, 1.870756, -0.127879, 0.314345, 1.990287, -0.134051, 0.142000, 1.589506, -0.142000, 0.139887, 1.723099, -0.139887, 0.231031, 1.870756, -0.231031, 0.242160, 1.990287, -0.242160, 0.078500, 1.589506, -0.184500, 0.077392, 1.723099, -0.181657, 0.127879, 1.870756, -0.299918, 0.134051, 1.990287, -0.314345, 0.510250, 1.289506, 1.199250, 0.453828, 1.378568, 1.066641, 0.000000, 1.378568, 1.156250, 0.000000, 1.289506, 1.300000, 0.323812, 1.439505, 0.761063, 0.000000, 1.439505, 0.825000, 0.179078, 1.500443, 0.420891, 0.000000, 1.500443, 0.456250, 0.923000, 1.289506, 0.923000, 0.820938, 1.378568, 0.820938, 0.585750, 1.439505, 0.585750, 0.323938, 1.500443, 0.323938, 1.199250, 1.289506, 0.510250, 1.066641, 1.378568, 0.453828, 0.761063, 1.439505, 0.323812, 0.420891, 1.500443, 0.179078, 1.300000, 1.289506, 0.000000, 1.156250, 1.378568, 0.000000, 0.825000, 1.439505, 0.000000, 0.456250, 1.500443, 0.000000, -1.199250, 1.289506, 0.510250, -1.066641, 1.378568, 0.453828, -1.156250, 1.378568, 0.000000, -1.300000, 1.289506, 0.000000, -0.761063, 1.439505, 0.323812, -0.825000, 1.439505, 0.000000, -0.420891, 1.500443, 0.179078, -0.456250, 1.500443, 0.000000, -0.923000, 1.289506, 0.923000, -0.820938, 1.378568, 0.820938, -0.585750, 1.439505, 0.585750, -0.323938, 1.500443, 0.323938, -0.510250, 1.289506, 1.199250, -0.453828, 1.378568, 1.066641, -0.323812, 1.439505, 0.761063, -0.179078, 1.500443, 0.420891, -0.510250, 1.289506, -1.199250, -0.453828, 1.378568, -1.066641, 0.000000, 1.378568, -1.156250, 0.000000, 1.289506, -1.300000, -0.323812, 1.439505, -0.761063, 0.000000, 1.439505, -0.825000, -0.179078, 1.500443, -0.420891, 0.000000, 1.500443, -0.456250, -0.923000, 1.289506, -0.923000, -0.820938, 1.378568, -0.820938, -0.585750, 1.439505, -0.585750, -0.323938, 1.500443, -0.323938, -1.199250, 1.289506, -0.510250, -1.066641, 1.378568, -0.453828, -0.761063, 1.439505, -0.323812, -0.420891, 1.500443, -0.179078, 1.199250, 1.289506, -0.510250, 1.066641, 1.378568, -0.453828, 0.761063, 1.439505, -0.323812, 0.420891, 1.500443, -0.179078, 0.923000, 1.289506, -0.923000, 0.820938, 1.378568, -0.820938, 0.585750, 1.439505, -0.585750, 0.323938, 1.500443, -0.323938, 0.510250, 1.289506, -1.199250, 0.453828, 1.378568, -1.066641, 0.323812, 1.439505, -0.761063, 0.179078, 1.500443, -0.420891, 0.575411, -1.015573, -1.352399, 0.000000, -1.015573, -1.466016, 0.504117, -1.063619, -1.184836, 0.000000, -1.063619, -1.284375, 0.327952, -1.097604, -0.770792, 0.000000, -1.097604, -0.835547, 0.000000, -1.110494, 0.000000, 1.040871, -1.015573, -1.040871, 0.911906, -1.063619, -0.911906, 0.593238, -1.097604, -0.593238, 1.352399, -1.015573, -0.575411, 1.184836, -1.063619, -0.504117, 0.770792, -1.097604, -0.327952, 1.466016, -1.015573, 0.000000, 1.284375, -1.063619, 0.000000, 0.835547, -1.097604, 0.000000, -1.352399, -1.015573, -0.575411, -1.466016, -1.015573, 0.000000, -1.184836, -1.063619, -0.504117, -1.284375, -1.063619, 0.000000, -0.770792, -1.097604, -0.327952, -0.835547, -1.097604, 0.000000, -1.040871, -1.015573, -1.040871, -0.911906, -1.063619, -0.911906, -0.593238, -1.097604, -0.593238, -0.575411, -1.015573, -1.352399, -0.504117, -1.063619, -1.184836, -0.327952, -1.097604, -0.770792, -0.575411, -1.015573, 1.352399, 0.000000, -1.015573, 1.466016, -0.504117, -1.063619, 1.184836, 0.000000, -1.063619, 1.284375, -0.327952, -1.097604, 0.770792, 0.000000, -1.097604, 0.835547, -1.040871, -1.015573, 1.040871, -0.911906, -1.063619, 0.911906, -0.593238, -1.097604, 0.593238, -1.352399, -1.015573, 0.575411, -1.184836, -1.063619, 0.504117, -0.770792, -1.097604, 0.327952, 1.352399, -1.015573, 0.575411, 1.184836, -1.063619, 0.504117, 0.770792, -1.097604, 0.327952, 1.040871, -1.015573, 1.040871, 0.911906, -1.063619, 0.911906, 0.593238, -1.097604, 0.593238, 0.575411, -1.015573, 1.352399, 0.504117, -1.063619, 1.184836, 0.327952, -1.097604, 0.770792
    ];
  }

  /**
   */
  getFaces() {
    return [
      1, 3, 0, 4, 2, 1, 6, 5, 4, 6, 9, 7, 11, 0, 10, 12, 1, 11, 13, 4, 12, 13, 8, 6, 15, 11, 10, 16, 12, 11, 17, 13, 12, 19, 13, 18, 20, 16, 15, 21, 17, 16, 22, 18, 17, 24, 18, 23, 26, 28, 25, 29, 27, 26, 31, 30, 29, 31, 34, 32, 36, 25, 35, 37, 26, 36, 38, 29, 37, 38, 33, 31, 40, 36, 35, 41, 37, 36, 42, 38, 37, 44, 38, 43, 3, 41, 40, 2, 42, 41, 5, 43, 42, 9, 43, 7, 46, 48, 45, 49, 47, 46, 51, 50, 49, 51, 54, 52, 56, 45, 55, 57, 46, 56, 58, 49, 57, 58, 53, 51, 60, 56, 55, 61, 57, 56, 62, 58, 57, 64, 58, 63, 28, 61, 60, 27, 62, 61, 30, 63, 62, 34, 63, 32, 66, 20, 65, 67, 21, 66, 68, 22, 67, 68, 24, 23, 71, 65, 70, 72, 66, 71, 73, 67, 72, 73, 69, 68, 75, 71, 70, 76, 72, 71, 77, 73, 72, 79, 73, 78, 48, 76, 75, 47, 77, 76, 50, 78, 77, 54, 78, 52, 81, 83, 80, 84, 82, 81, 86, 85, 84, 0, 87, 86, 89, 80, 88, 90, 81, 89, 91, 84, 90, 10, 86, 91, 92, 89, 88, 93, 90, 89, 94, 91, 90, 95, 10, 91, 96, 93, 92, 97, 94, 93, 98, 95, 94, 99, 15, 95, 101, 103, 100, 104, 102, 101, 106, 105, 104, 25, 107, 106, 109, 100, 108, 110, 101, 109, 111, 104, 110, 35, 106, 111, 112, 109, 108, 113, 110, 109, 114, 111, 110, 115, 35, 111, 83, 113, 112, 82, 114, 113, 85, 115, 114, 87, 40, 115, 117, 119, 116, 120, 118, 117, 122, 121, 120, 45, 123, 122, 125, 116, 124, 126, 117, 125, 127, 120, 126, 55, 122, 127, 128, 125, 124, 129, 126, 125, 130, 127, 126, 131, 55, 127, 103, 129, 128, 102, 130, 129, 105, 131, 130, 107, 60, 131, 133, 96, 132, 134, 97, 133, 135, 98, 134, 65, 99, 135, 137, 132, 136, 138, 133, 137, 139, 134, 138, 70, 135, 139, 140, 137, 136, 141, 138, 137, 142, 139, 138, 143, 70, 139, 119, 141, 140, 118, 142, 141, 121, 143, 142, 123, 75, 143, 144, 146, 147, 145, 149, 146, 148, 151, 149, 150, 83, 151, 152, 145, 144, 153, 148, 145, 154, 150, 148, 155, 80, 150, 157, 152, 156, 158, 153, 157, 159, 154, 158, 92, 155, 159, 161, 156, 160, 162, 157, 161, 163, 158, 162, 96, 159, 163, 164, 166, 167, 165, 169, 166, 168, 171, 169, 170, 103, 171, 172, 165, 164, 173, 168, 165, 174, 170, 168, 175, 100, 170, 177, 172, 176, 178, 173, 177, 179, 174, 178, 112, 175, 179, 146, 176, 147, 149, 177, 146, 151, 178, 149, 83, 179, 151, 180, 182, 183, 181, 185, 182, 184, 187, 185, 186, 119, 187, 188, 181, 180, 189, 184, 181, 190, 186, 184, 191, 116, 186, 193, 188, 192, 194, 189, 193, 195, 190, 194, 128, 191, 195, 166, 192, 167, 169, 193, 166, 171, 194, 169, 103, 195, 171, 196, 161, 160, 197, 162, 161, 198, 163, 162, 199, 96, 163, 200, 197, 196, 201, 198, 197, 202, 199, 198, 203, 132, 199, 205, 200, 204, 206, 201, 205, 207, 202, 206, 140, 203, 207, 182, 204, 183, 185, 205, 182, 187, 206, 185, 119, 207, 187, 208, 210, 211, 209, 213, 210, 212, 215, 213, 216, 215, 214, 218, 209, 208, 219, 212, 209, 220, 214, 212, 222, 214, 221, 223, 219, 218, 224, 220, 219, 225, 221, 220, 227, 221, 226, 228, 224, 223, 229, 225, 224, 230, 226, 225, 232, 226, 231, 234, 228, 233, 235, 229, 234, 236, 230, 235, 236, 232, 231, 239, 233, 238, 240, 234, 239, 241, 235, 240, 241, 237, 236, 244, 238, 243, 245, 239, 244, 246, 240, 245, 246, 242, 241, 210, 243, 211, 213, 244, 210, 215, 245, 213, 215, 247, 246, 248, 250, 251, 249, 253, 250, 252, 255, 253, 254, 211, 255, 256, 249, 248, 257, 252, 249, 258, 254, 252, 259, 208, 254, 260, 257, 256, 261, 258, 257, 262, 259, 258, 263, 218, 259, 103, 261, 260, 264, 262, 261, 265, 263, 262, 266, 223, 263, 268, 103, 267, 269, 264, 268, 270, 265, 269, 233, 266, 270, 272, 267, 271, 273, 268, 272, 274, 269, 273, 238, 270, 274, 276, 271, 275, 277, 272, 276, 278, 273, 277, 243, 274, 278, 250, 275, 251, 253, 276, 250, 255, 277, 253, 211, 278, 255, 279, 281, 282, 283, 281, 280, 285, 284, 283, 287, 286, 285, 289, 280, 279, 291, 280, 290, 292, 283, 291, 293, 285, 292, 294, 290, 289, 296, 290, 295, 297, 291, 296, 298, 292, 297, 299, 295, 294, 301, 295, 300, 302, 296, 301, 303, 297, 302, 305, 299, 304, 305, 301, 300, 306, 302, 301, 307, 303, 302, 310, 304, 309, 310, 306, 305, 311, 307, 306, 312, 308, 307, 315, 309, 314, 315, 311, 310, 316, 312, 311, 317, 313, 312, 281, 314, 282, 281, 316, 315, 284, 317, 316, 286, 318, 317, 320, 322, 319, 323, 321, 320, 323, 326, 324, 325, 282, 326, 328, 319, 327, 329, 320, 328, 329, 325, 323, 330, 279, 325, 332, 327, 331, 333, 328, 332, 333, 330, 329, 334, 289, 330, 336, 331, 335, 337, 332, 336, 337, 334, 333, 338, 294, 334, 339, 336, 335, 340, 337, 336, 342, 337, 341, 304, 338, 342, 343, 340, 339, 344, 341, 340, 346, 341, 345, 309, 342, 346, 347, 344, 343, 348, 345, 344, 350, 345, 349, 314, 346, 350, 322, 348, 347, 321, 349, 348, 326, 349, 324, 282, 350, 326, 351, 353, 354, 352, 356, 353, 355, 358, 356, 357, 359, 358, 360, 352, 351, 361, 355, 352, 362, 357, 355, 363, 359, 357, 365, 360, 364, 366, 361, 365, 367, 362, 366, 367, 359, 363, 369, 364, 368, 370, 365, 369, 371, 366, 370, 371, 359, 367, 372, 374, 375, 373, 377, 374, 376, 379, 377, 378, 359, 379, 380, 373, 372, 381, 376, 373, 382, 378, 376, 383, 359, 378, 385, 380, 384, 386, 381, 385, 387, 382, 386, 387, 359, 383, 353, 384, 354, 356, 385, 353, 358, 386, 356, 358, 359, 387, 388, 390, 391, 389, 393, 390, 392, 395, 393, 394, 359, 395, 396, 389, 388, 397, 392, 389, 398, 394, 392, 399, 359, 394, 401, 396, 400, 402, 397, 401, 403, 398, 402, 403, 359, 399, 374, 400, 375, 377, 401, 374, 379, 402, 377, 379, 359, 403, 404, 369, 368, 405, 370, 369, 406, 371, 370, 407, 359, 371, 408, 405, 404, 409, 406, 405, 410, 407, 406, 411, 359, 407, 413, 408, 412, 414, 409, 413, 415, 410, 414, 415, 359, 411, 390, 412, 391, 393, 413, 390, 395, 414, 393, 395, 359, 415, 417, 419, 416, 420, 418, 417, 422, 421, 420, 351, 423, 422, 425, 416, 424, 426, 417, 425, 427, 420, 426, 360, 422, 427, 428, 425, 424, 429, 426, 425, 430, 427, 426, 431, 360, 427, 432, 429, 428, 433, 430, 429, 434, 431, 430, 435, 364, 431, 437, 439, 436, 440, 438, 437, 442, 441, 440, 372, 443, 442, 445, 436, 444, 446, 437, 445, 447, 440, 446, 380, 442, 447, 448, 445, 444, 449, 446, 445, 450, 447, 446, 451, 380, 447, 419, 449, 448, 418, 450, 449, 421, 451, 450, 423, 384, 451, 453, 455, 452, 456, 454, 453, 458, 457, 456, 388, 459, 458, 461, 452, 460, 462, 453, 461, 463, 456, 462, 396, 458, 463, 464, 461, 460, 465, 462, 461, 466, 463, 462, 467, 396, 463, 439, 465, 464, 438, 466, 465, 441, 467, 466, 443, 400, 467, 469, 432, 468, 470, 433, 469, 471, 434, 470, 404, 435, 471, 473, 468, 472, 474, 469, 473, 475, 470, 474, 408, 471, 475, 476, 473, 472, 477, 474, 473, 478, 475, 474, 479, 408, 475, 455, 477, 476, 454, 478, 477, 457, 479, 478, 459, 412, 479, 480, 183, 204, 482, 481, 480, 484, 483, 482, 484, 486, 485, 487, 204, 200, 488, 480, 487, 489, 482, 488, 489, 486, 484, 196, 487, 200, 490, 488, 487, 491, 489, 488, 492, 486, 489, 160, 490, 196, 493, 491, 490, 494, 492, 491, 495, 486, 492, 496, 167, 192, 498, 497, 496, 500, 499, 498, 500, 486, 501, 502, 192, 188, 503, 496, 502, 504, 498, 503, 504, 486, 500, 180, 502, 188, 505, 503, 502, 506, 504, 503, 507, 486, 504, 183, 505, 180, 481, 506, 505, 483, 507, 506, 485, 486, 507, 508, 147, 176, 510, 509, 508, 512, 511, 510, 512, 486, 513, 514, 176, 172, 515, 508, 514, 516, 510, 515, 516, 486, 512, 164, 514, 172, 517, 515, 514, 518, 516, 515, 519, 486, 516, 167, 517, 164, 497, 518, 517, 499, 519, 518, 501, 486, 519, 520, 160, 156, 521, 493, 520, 522, 494, 521, 522, 486, 495, 523, 156, 152, 524, 520, 523, 525, 521, 524, 525, 486, 522, 144, 523, 152, 526, 524, 523, 527, 525, 524, 528, 486, 525, 147, 526, 144, 509, 527, 526, 511, 528, 527, 513, 486, 528, 1, 2, 3, 4, 5, 2, 6, 7, 5, 6, 8, 9, 11, 1, 0, 12, 4, 1, 13, 6, 4, 13, 14, 8, 15, 16, 11, 16, 17, 12, 17, 18, 13, 19, 14, 13, 20, 21, 16, 21, 22, 17, 22, 23, 18, 24, 19, 18, 26, 27, 28, 29, 30, 27, 31, 32, 30, 31, 33, 34, 36, 26, 25, 37, 29, 26, 38, 31, 29, 38, 39, 33, 40, 41, 36, 41, 42, 37, 42, 43, 38, 44, 39, 38, 3, 2, 41, 2, 5, 42, 5, 7, 43, 9, 44, 43, 46, 47, 48, 49, 50, 47, 51, 52, 50, 51, 53, 54, 56, 46, 45, 57, 49, 46, 58, 51, 49, 58, 59, 53, 60, 61, 56, 61, 62, 57, 62, 63, 58, 64, 59, 58, 28, 27, 61, 27, 30, 62, 30, 32, 63, 34, 64, 63, 66, 21, 20, 67, 22, 21, 68, 23, 22, 68, 69, 24, 71, 66, 65, 72, 67, 66, 73, 68, 67, 73, 74, 69, 75, 76, 71, 76, 77, 72, 77, 78, 73, 79, 74, 73, 48, 47, 76, 47, 50, 77, 50, 52, 78, 54, 79, 78, 81, 82, 83, 84, 85, 82, 86, 87, 85, 0, 3, 87, 89, 81, 80, 90, 84, 81, 91, 86, 84, 10, 0, 86, 92, 93, 89, 93, 94, 90, 94, 95, 91, 95, 15, 10, 96, 97, 93, 97, 98, 94, 98, 99, 95, 99, 20, 15, 101, 102, 103, 104, 105, 102, 106, 107, 105, 25, 28, 107, 109, 101, 100, 110, 104, 101, 111, 106, 104, 35, 25, 106, 112, 113, 109, 113, 114, 110, 114, 115, 111, 115, 40, 35, 83, 82, 113, 82, 85, 114, 85, 87, 115, 87, 3, 40, 117, 118, 119, 120, 121, 118, 122, 123, 121, 45, 48, 123, 125, 117, 116, 126, 120, 117, 127, 122, 120, 55, 45, 122, 128, 129, 125, 129, 130, 126, 130, 131, 127, 131, 60, 55, 103, 102, 129, 102, 105, 130, 105, 107, 131, 107, 28, 60, 133, 97, 96, 134, 98, 97, 135, 99, 98, 65, 20, 99, 137, 133, 132, 138, 134, 133, 139, 135, 134, 70, 65, 135, 140, 141, 137, 141, 142, 138, 142, 143, 139, 143, 75, 70, 119, 118, 141, 118, 121, 142, 121, 123, 143, 123, 48, 75, 144, 145, 146, 145, 148, 149, 148, 150, 151, 150, 80, 83, 152, 153, 145, 153, 154, 148, 154, 155, 150, 155, 88, 80, 157, 153, 152, 158, 154, 153, 159, 155, 154, 92, 88, 155, 161, 157, 156, 162, 158, 157, 163, 159, 158, 96, 92, 159, 164, 165, 166, 165, 168, 169, 168, 170, 171, 170, 100, 103, 172, 173, 165, 173, 174, 168, 174, 175, 170, 175, 108, 100, 177, 173, 172, 178, 174, 173, 179, 175, 174, 112, 108, 175, 146, 177, 176, 149, 178, 177, 151, 179, 178, 83, 112, 179, 180, 181, 182, 181, 184, 185, 184, 186, 187, 186, 116, 119, 188, 189, 181, 189, 190, 184, 190, 191, 186, 191, 124, 116, 193, 189, 188, 194, 190, 189, 195, 191, 190, 128, 124, 191, 166, 193, 192, 169, 194, 193, 171, 195, 194, 103, 128, 195, 196, 197, 161, 197, 198, 162, 198, 199, 163, 199, 132, 96, 200, 201, 197, 201, 202, 198, 202, 203, 199, 203, 136, 132, 205, 201, 200, 206, 202, 201, 207, 203, 202, 140, 136, 203, 182, 205, 204, 185, 206, 205, 187, 207, 206, 119, 140, 207, 208, 209, 210, 209, 212, 213, 212, 214, 215, 216, 217, 215, 218, 219, 209, 219, 220, 212, 220, 221, 214, 222, 216, 214, 223, 224, 219, 224, 225, 220, 225, 226, 221, 227, 222, 221, 228, 229, 224, 229, 230, 225, 230, 231, 226, 232, 227, 226, 234, 229, 228, 235, 230, 229, 236, 231, 230, 236, 237, 232, 239, 234, 233, 240, 235, 234, 241, 236, 235, 241, 242, 237, 244, 239, 238, 245, 240, 239, 246, 241, 240, 246, 247, 242, 210, 244, 243, 213, 245, 244, 215, 246, 245, 215, 217, 247, 248, 249, 250, 249, 252, 253, 252, 254, 255, 254, 208, 211, 256, 257, 249, 257, 258, 252, 258, 259, 254, 259, 218, 208, 260, 261, 257, 261, 262, 258, 262, 263, 259, 263, 223, 218, 103, 264, 261, 264, 265, 262, 265, 266, 263, 266, 228, 223, 268, 264, 103, 269, 265, 264, 270, 266, 265, 233, 228, 266, 272, 268, 267, 273, 269, 268, 274, 270, 269, 238, 233, 270, 276, 272, 271, 277, 273, 272, 278, 274, 273, 243, 238, 274, 250, 276, 275, 253, 277, 276, 255, 278, 277, 211, 243, 278, 279, 280, 281, 283, 284, 281, 285, 286, 284, 287, 288, 286, 289, 290, 280, 291, 283, 280, 292, 285, 283, 293, 287, 285, 294, 295, 290, 296, 291, 290, 297, 292, 291, 298, 293, 292, 299, 300, 295, 301, 296, 295, 302, 297, 296, 303, 298, 297, 305, 300, 299, 305, 306, 301, 306, 307, 302, 307, 308, 303, 310, 305, 304, 310, 311, 306, 311, 312, 307, 312, 313, 308, 315, 310, 309, 315, 316, 311, 316, 317, 312, 317, 318, 313, 281, 315, 314, 281, 284, 316, 284, 286, 317, 286, 288, 318, 320, 321, 322, 323, 324, 321, 323, 325, 326, 325, 279, 282, 328, 320, 319, 329, 323, 320, 329, 330, 325, 330, 289, 279, 332, 328, 327, 333, 329, 328, 333, 334, 330, 334, 294, 289, 336, 332, 331, 337, 333, 332, 337, 338, 334, 338, 299, 294, 339, 340, 336, 340, 341, 337, 342, 338, 337, 304, 299, 338, 343, 344, 340, 344, 345, 341, 346, 342, 341, 309, 304, 342, 347, 348, 344, 348, 349, 345, 350, 346, 345, 314, 309, 346, 322, 321, 348, 321, 324, 349, 326, 350, 349, 282, 314, 350, 351, 352, 353, 352, 355, 356, 355, 357, 358, 360, 361, 352, 361, 362, 355, 362, 363, 357, 365, 361, 360, 366, 362, 361, 367, 363, 362, 369, 365, 364, 370, 366, 365, 371, 367, 366, 372, 373, 374, 373, 376, 377, 376, 378, 379, 380, 381, 373, 381, 382, 376, 382, 383, 378, 385, 381, 380, 386, 382, 381, 387, 383, 382, 353, 385, 384, 356, 386, 385, 358, 387, 386, 388, 389, 390, 389, 392, 393, 392, 394, 395, 396, 397, 389, 397, 398, 392, 398, 399, 394, 401, 397, 396, 402, 398, 397, 403, 399, 398, 374, 401, 400, 377, 402, 401, 379, 403, 402, 404, 405, 369, 405, 406, 370, 406, 407, 371, 408, 409, 405, 409, 410, 406, 410, 411, 407, 413, 409, 408, 414, 410, 409, 415, 411, 410, 390, 413, 412, 393, 414, 413, 395, 415, 414, 417, 418, 419, 420, 421, 418, 422, 423, 421, 351, 354, 423, 425, 417, 416, 426, 420, 417, 427, 422, 420, 360, 351, 422, 428, 429, 425, 429, 430, 426, 430, 431, 427, 431, 364, 360, 432, 433, 429, 433, 434, 430, 434, 435, 431, 435, 368, 364, 437, 438, 439, 440, 441, 438, 442, 443, 441, 372, 375, 443, 445, 437, 436, 446, 440, 437, 447, 442, 440, 380, 372, 442, 448, 449, 445, 449, 450, 446, 450, 451, 447, 451, 384, 380, 419, 418, 449, 418, 421, 450, 421, 423, 451, 423, 354, 384, 453, 454, 455, 456, 457, 454, 458, 459, 457, 388, 391, 459, 461, 453, 452, 462, 456, 453, 463, 458, 456, 396, 388, 458, 464, 465, 461, 465, 466, 462, 466, 467, 463, 467, 400, 396, 439, 438, 465, 438, 441, 466, 441, 443, 467, 443, 375, 400, 469, 433, 432, 470, 434, 433, 471, 435, 434, 404, 368, 435, 473, 469, 468, 474, 470, 469, 475, 471, 470, 408, 404, 471, 476, 477, 473, 477, 478, 474, 478, 479, 475, 479, 412, 408, 455, 454, 477, 454, 457, 478, 457, 459, 479, 459, 391, 412, 480, 481, 183, 482, 483, 481, 484, 485, 483, 487, 480, 204, 488, 482, 480, 489, 484, 482, 196, 490, 487, 490, 491, 488, 491, 492, 489, 160, 493, 490, 493, 494, 491, 494, 495, 492, 496, 497, 167, 498, 499, 497, 500, 501, 499, 502, 496, 192, 503, 498, 496, 504, 500, 498, 180, 505, 502, 505, 506, 503, 506, 507, 504, 183, 481, 505, 481, 483, 506, 483, 485, 507, 508, 509, 147, 510, 511, 509, 512, 513, 511, 514, 508, 176, 515, 510, 508, 516, 512, 510, 164, 517, 514, 517, 518, 515, 518, 519, 516, 167, 497, 517, 497, 499, 518, 499, 501, 519, 520, 493, 160, 521, 494, 493, 522, 495, 494, 523, 520, 156, 524, 521, 520, 525, 522, 521, 144, 526, 523, 526, 527, 524, 527, 528, 525, 147, 509, 526, 509, 511, 527, 511, 513, 528
    ];
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
