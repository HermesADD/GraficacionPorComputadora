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
    this.normals = this.getNormals(this.vertices);

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

    //////////////////////////////////////////////////
    // Se crea el buffer de normales
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    //////////////////////////////////////////////////


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    this.num_elements = this.vertices.length/3;

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
    gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
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
       this.w/2,  this.h/2, -this.l/2,  
       this.w/2, -this.h/2,  this.l/2,  
       this.w/2, -this.h/2, -this.l/2,

       this.w/2,  this.h/2, -this.l/2,  
       this.w/2,  this.h/2,  this.l/2,  
       this.w/2, -this.h/2,  this.l/2,

       this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,

       this.w/2, -this.h/2,  this.l/2,  
       this.w/2,  this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2,

      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,

      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2,  this.h/2,  this.l/2, 
      -this.w/2,  this.h/2, -this.l/2,

      -this.w/2,  this.h/2, -this.l/2,  
       this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,

      -this.w/2,  this.h/2, -this.l/2,  
       this.w/2,  this.h/2, -this.l/2,  
       this.w/2, -this.h/2, -this.l/2,

      -this.w/2,  this.h/2,  this.l/2,  
       this.w/2,  this.h/2, -this.l/2, 
      -this.w/2,  this.h/2, -this.l/2,

      -this.w/2,  this.h/2,  this.l/2,  
       this.w/2,  this.h/2,  this.l/2,  
       this.w/2,  this.h/2, -this.l/2,

       this.w/2, -this.h/2, -this.l/2, 
      -this.w/2, -this.h/2,  this.l/2, 
      -this.w/2, -this.h/2, -this.l/2,

       this.w/2, -this.h/2, -this.l/2,  
       this.w/2, -this.h/2,  this.l/2, 
      -this.w/2, -this.h/2,  this.l/2,
    ];
  }

  /** */
  getNormals(vertices) {
    let normals = [];
    let v1, v2, v3;
    let n;

    // Se itera de 9 en 9 vértices, ya que 3 vértices con 3 componentes (x,y,z) determinan un triángulo
    for (let i=0; i<vertices.length; i+=9) {
      // Se construye el primer vértice con sus coordenadas
      v1 = { x: vertices[i  ], y: vertices[i+1], z: vertices[i+2] };
      // Se construye el segundo vértice con sus coordenadas
      v2 = { x: vertices[i+3], y: vertices[i+4], z: vertices[i+5] };

      // Se construye el tercer vértice con sus coordenadas
      v3 = { x: vertices[i+6], y: vertices[i+7], z: vertices[i+8] };

      // Tomando el producto cruz de dos vectores tangentes al triángulo se obtiene la normal, si cambia la dirección de alguno de los dos vectores entonces la normal invierte su dirección
      n = normalize(
        cross(subtract(v1, v2), subtract(v2, v3))
      );

      // Se agrega el vector normal tres veces, ya que cada vértice comparte la misma normal
      normals.push(
        n.x, n.y, n.z, 
        n.x, n.y, n.z, 
        n.x, n.y, n.z
      );
    }

    return normals;
  }
}
