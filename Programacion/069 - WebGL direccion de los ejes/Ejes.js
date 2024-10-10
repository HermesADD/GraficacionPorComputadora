class Ejes {
  /**
   */
  constructor(gl, l=5, w=0.05) {
    this.length = l;
    this.width = w;

    let vertexShaderSource = 
    `#version 300 es
    in vec4 a_position;
  
    uniform mat4 u_PVM_matrix;
    
    void main() {
      gl_Position = u_PVM_matrix * a_position;
    }`;
  
    let fragmentShaderSource = 
    `#version 300 es
    precision mediump float;
  
    uniform vec4 u_color;
  
    out vec4 pixelColor;
  
    void main() {
      pixelColor = u_color;
    }`;
  
    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  
    // Hay que recordar que los atributos (elementos con modificador in) se asocian a los buffers por medio de los VAO
    let positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");

    // Los uniformes se tienen que enviar antes de las funciones de dibujado, para que los valores estén listos para su uso
    this.colorUniformLocation = gl.getUniformLocation(this.program, "u_color");
    this.PVM_matrixLocation = gl.getUniformLocation(this.program, "u_PVM_matrix");


    ////////////////////////////////////////
    // Eje X
    ////////////////////////////////////////
    this.ejeX_VAO = gl.createVertexArray();
    gl.bindVertexArray(this.ejeX_VAO);

    let axisXBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisXBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, -this.width, 0,
      0,  this.width, 0,
      this.length,  this.width, 0,
      this.length, -this.width, 0
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    ////////////////////////////////////////
    // Eje Y
    ////////////////////////////////////////
    this.ejeY_VAO = gl.createVertexArray();
    gl.bindVertexArray(this.ejeY_VAO);

    let axisYBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisYBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0, -this.width,
      0, 0,  this.width,
      0, this.length,  this.width,
      0, this.length, -this.width,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    ////////////////////////////////////////
    // Eje Z
    ////////////////////////////////////////
    this.ejeZ_VAO = gl.createVertexArray();
    gl.bindVertexArray(this.ejeZ_VAO);

    let axisZBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisZBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, -this.width, 0,
      0,  this.width, 0,
      0,  this.width, this.length,
      0, -this.width, this.length,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   * Función que se encarga de dibujar los ejes coordenados
   * @param {WebGL2RenderingContext} gl el contexto de render de WebGL2
   * @param {Array} projectionViewMatrix Matriz de vista y proyección, está matriz debe ser un arreglo para enviar la información a WebGL
   */
  draw(gl, projectionViewMatrix) {
    // Se activa el programa, cada eje utiliza un mismo programa
    gl.useProgram(this.program);

    // En este caso todos los ejes utilizan la misma matriz de vista y proyección, así que solo se envía una vez está información
    gl.uniformMatrix4fv(this.PVM_matrixLocation, true, projectionViewMatrix);


    // Se dibuja el eje X por medio de su Vertex Array Object
    // El eje X se dibuja de color rojo = [1,0,0,1]
    gl.bindVertexArray(this.ejeX_VAO);
    gl.uniform4fv(this.colorUniformLocation, [1.0, 0.0, 0.0, 1.0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);


    // Se dibuja el eje Y por medio de su Vertex Array Object
    // El eje Y se dibuja de color rojo = [0,1,0,1]
    gl.bindVertexArray(this.ejeY_VAO);
    gl.uniform4fv(this.colorUniformLocation, [0.0, 1.0, 0.0, 1.0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);


    // Se dibuja el eje Z por medio de su Vertex Array Object
    // El eje Z se dibuja de color rojo = [0,0,1,1]
    gl.bindVertexArray(this.ejeZ_VAO);
    gl.uniform4fv(this.colorUniformLocation, [0.0, 0.0, 1.0, 1.0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);
  }
}
