class PrismaRectangular {
  /**
   */
  constructor(gl, width=1, height=1, length=1, color="#ffffff", transform=identity()) {
    this.w = width;
    this.h = height;
    this.l = length;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
    this.normals = this.getNormals(this.vertices, this.faces);

    console.log(this.normals);

    
    let vertexShaderSource =
    `#version 300 es
    in vec4 a_position;

    // el atributo para asociar la normal del vértice
    in vec3 a_normal;

    // matrix de transformación del modelo y la vista
    uniform mat4 u_VM_matrix;
    // matrix de transformación del modelo, la vista y la proyección
    uniform mat4 u_PVM_matrix;

    // variable que almacena la posición del vértice en coordenadas de la cámara, para los cálculos de iluminación
    out vec3 v_position;
    // variable que almacena la normal asociada al vértice, transformada al espacio de la cámara
    out vec3 v_normal;

    void main() {
      // tanto la posición como la normal se transforman al mismo espacio de representación, en este caso el espacio de la cámara para realizar el cálculo de la iluminación
      v_position = vec3( u_VM_matrix * a_position );
      v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );

      gl_Position = u_PVM_matrix * a_position;
    }`;

    let fragmentShaderSource =
    `#version 300 es
    precision mediump float;

    // posición interpolada de los vértices enviada desde el shader de vértices
    in vec3 v_position;
    // normal interpolada asociado al vértice, también enviada desde el shader de vértices
    in vec3 v_normal;

    uniform vec3 u_light_position;
    uniform vec4 u_color;

    out vec4 pixelColor;

    void main() {
      // vector de dirección de la luz hacia el fragmento que se quiere colorear, en este caso una luz puntual
      vec3 to_light = normalize( u_light_position - v_position );


      // como la normal se envía desde el shader de vértices de forma interpolada, no siempre se puede garantizar que el vector sea unitario, por lo que es necesario normalizarlo antes de usarlo
      vec3 fragment_normal = normalize(v_normal);

      // se calcula el coseno del angulo entre el vector de dirección de la luz y la normal del fragmento que se quiere colorear
      float cos_angle = max(dot(fragment_normal, to_light), 0.0);

      // el color final del objeto es el color atenuado por el valor del coseno del ángulo
      pixelColor = vec4(vec3(u_color) * cos_angle, u_color.a);
    }`;

    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    let positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(this.program, "a_normal");

    this.colorUniformLocation = gl.getUniformLocation(this.program, "u_color");
    this.lightUniformLocation = gl.getUniformLocation(this.program, "u_light_position");
    this.PVM_matrixLocation = gl.getUniformLocation(this.program, "u_PVM_matrix");
    this.VM_matrixLocation = gl.getUniformLocation(this.program, "u_VM_matrix");


    this.shapeVAO = gl.createVertexArray();
    gl.bindVertexArray(this.shapeVAO);


    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    this.num_elements = this.faces.length;

    this.theta = 0;


    //////////////////////////////////////////////////
    // Para visualizar las normales hay que construir su geometría, en este caso un segmento para indicar el vector normal
    // el segmento tiene como punto inicial la posición de un vértice y como punto final la posición del vértice más su normal asociada

    this.normals_program = createProgram(
      gl, 
      `#version 300 es
       in vec4 a_position;
       uniform mat4 u_PVM_matrix;
       void main() {
        gl_Position = u_PVM_matrix * a_position;
       }`, 
       `#version 300 es
       precision mediump float;
       out vec4 pixelColor;
       void main() {
        pixelColor = vec4(0, 0, 0, 1.0);
       }`
    );

    let positionNormalAttributeLocation = gl.getAttribLocation(this.normals_program, "a_position");
    this.PVM_Normal_matrixLocation = gl.getUniformLocation(this.normals_program, "u_PVM_matrix");


    this.normalVAO = gl.createVertexArray();
    gl.bindVertexArray(this.normalVAO);

    // arreglo para almacenar las normales
    let normals_segments = [];

    // se itera de 3 en 3, por las tres componentes de cada vértice
    for (let i=0; i<this.vertices.length; i+=3) {
      normals_segments.push(
        // punto inicial
        this.vertices[i],    // v.x
        this.vertices[i +1], // v.y
        this.vertices[i +2], // v.z

        // punto final
        this.vertices[i] + this.normals[i],       // v.x + n.x
        this.vertices[i +1] + this.normals[i +1], // v.y + n.y
        this.vertices[i +2] + this.normals[i +2], // v.z + n.z
      );
    }
    // El buffer para dibujar los segmentos correspondientes a las normales
    let normalSegmentsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalSegmentsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals_segments), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionNormalAttributeLocation);
    gl.vertexAttribPointer(positionNormalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    this.num_normals_elements = normals_segments.length/3;

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   *
   */
  update(elapsed) {
    this.transform = rotateY(this.theta += elapsed);
  }

  /**
   *
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


    // se dibuja el PrismaRectangular
    gl.bindVertexArray(this.shapeVAO);
    gl.drawElements(gl.TRIANGLES, this.num_elements, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);


    // se dibujan las normales
    // se activa el programa de las normales
    gl.useProgram(this.normals_program);

    // se envía la información de la matriz del modelo la vista y la proyección, u_PVM_matrix
    gl.uniformMatrix4fv(this.PVM_Normal_matrixLocation, true, projectionViewModelMatrix);

    // se dibujan las líneas
    gl.bindVertexArray(this.normalVAO);
    gl.drawArrays(gl.LINES, 0, this.num_normals_elements);
    gl.bindVertexArray(null);
  }

  /**
   */
  getVertices() {
    return [
      this.w/2,  this.h/2,  this.l/2,
      this.w/2, -this.h/2,  this.l/2,
      this.w/2,  this.h/2, -this.l/2,
      this.w/2, -this.h/2, -this.l/2,
     -this.w/2,  this.h/2,  this.l/2,
     -this.w/2, -this.h/2,  this.l/2,
     -this.w/2,  this.h/2, -this.l/2,
     -this.w/2, -this.h/2, -this.l/2,
    ];
  }

  /**
   */
  getFaces() {
    return [
      2, 1, 3,
      2, 0, 1,

      1, 4, 5,
      1, 0, 4,

      5, 6, 7,
      5, 4, 6,

      6, 3, 7,
      6, 2, 3,

      4, 2, 6,
      4, 0, 2,

      3, 5, 7,
      3, 1, 5,
    ];
  }

  /**
   * Se construyen las normales en base a la información dada en las caras del prisma
   */
  getNormals(vertices, faces) {
    // Arreglo donde se almacenan las normales
    // Cada vértice va a tener una normal asociada
    let normals = new Array(vertices.length);
    // se llena el arreglo de normales con ceros, para almacenar el promedio de las normales que se van a asignar al vértice
    normals.fill(0);

    let v1, v2, v3;
    let i1, i2, i3;
    let tmp;
    let n;

    // Se recorre el arreglo de caras de 3 en 3, ya que cada tres indices determina un triángulo
    for (let i=0; i<faces.length; i+=3) {
      // se obtiene el indice del primer vértice de un triángulo
      i1 = faces[i  ]*3;
      // se obtiene el indice del segundo vértice de un triángulo
      i2 = faces[i+1]*3;
      // se obtiene el indice del tercer vértice de un triángulo
      i3 = faces[i+2]*3;

      // Se construye el primer vértice con sus coordenadas
      v1 = { x: vertices[i1], y: vertices[i1 + 1], z: vertices[i1 + 2] };
      // Se construye el segundo vértice con sus coordenadas
      v2 = { x: vertices[i2], y: vertices[i2 + 1], z:vertices[i2 + 2] };
      // Se construye el tercer vértice con sus coordenadas
      v3 = { x: vertices[i3], y: vertices[i3 + 1], z: vertices[i3 + 2] };
      // Tomando el producto cruz de dos vectores tangentes al triángulo se obtiene la normal, si cambia la dirección de alguno de los dos vectores entonces la normal invierte su dirección
      n = normalize(
        cross(subtract(v1, v2), subtract(v2, v3))
      );

      // Se extrae la información de la normal asociada al primer vértice, para sumar el valor de la nueva normal calculada
      tmp = { x: normals[i1], y: normals[i1+1], z: normals[i1+2] };
      tmp = add(tmp, n);

      // Se almacena la nueva normal para el primer vértice
      normals[i1  ] = tmp.x;
      normals[i1+1] = tmp.y;
      normals[i1+2] = tmp.z;


      // Se extrae la información de la normal asociada al segundo vértice, para sumar el valor de la nueva normal calculada
      tmp = { x: normals[i2], y: normals[i2+1], z: normals[i2+2] };
      tmp = add(tmp, n);

      // Se almacena la nueva normal para el segundo vértice
      normals[i2  ] = tmp.x;
      normals[i2+1] = tmp.y;
      normals[i2+2] = tmp.z;


      // Se extrae la información de la normal asociada al tercer vértice, para sumar el valor de la nueva normal calculada
      tmp = { x: normals[i3], y: normals[i3+1], z: normals[i3+2] };
      tmp = add(tmp, n);

      // Se almacena la nueva normal para el tercer vértice
      normals[i3  ] = tmp.x;
      normals[i3+1] = tmp.y;
      normals[i3+2] = tmp.z;
    }

    // Los valores almacenados en el arreglo normals es la suma de todas las normales a las que pertenece cada vértice; esta suma no es unitaria, por lo que es necesario normalizar el vector
    for (let i=0; i<normals.length; i+=3) {
      tmp = normalize({ x: normals[i], y: normals[i+1], z: normals[i+2] });
      normals[i  ] = tmp.x;
      normals[i+1] = tmp.y;
      normals[i+2] = tmp.z;
    }

    return normals;
  }
}
